#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CODE MODE UTCP CONFIGURATION VALIDATOR
# ───────────────────────────────────────────────────────────────
"""Code Mode UTCP Configuration Validator.

Validates .utcp_config.json files for:
- Valid JSON structure
- Valid manual names (JavaScript identifiers)
- Required fields present
- No duplicate manual names
- Environment variable references valid
- MCP server configuration completeness

Usage:
    python3 validate_config.py <path-to-.utcp_config.json>
    python3 validate_config.py <path-to-.utcp_config.json> --check-env <path-to-.env>
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

VALID_IDENTIFIER = re.compile(r'^[a-zA-Z_$][a-zA-Z0-9_$]*$')
ENV_VAR_PATTERN = re.compile(r'\$\{([A-Z_][A-Z0-9_]*)\}')


# ───────────────────────────────────────────────────────────────
# 2. VALIDATOR
# ───────────────────────────────────────────────────────────────

class ConfigValidator:
    """Validates Code Mode UTCP configuration files.

    Performs structural validation on .utcp_config.json files,
    checking JSON syntax, manual name conventions, required fields,
    and optionally validating environment variable references against
    a .env file.

    Args:
        config_path: Path to the .utcp_config.json file.
        env_path: Optional path to a .env file for variable validation.
    """

    def __init__(self, config_path: str, env_path: Optional[str] = None) -> None:
        self.config_path = Path(config_path)
        self.env_path = Path(env_path) if env_path else None
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.config: Dict[str, Any] = {}
        self.env_vars: Set[str] = set()
        self._required_env_vars: Set[Tuple[str, str]] = set()

    def validate(self) -> bool:
        """Run all validation checks.

        Returns:
            True if validation passed with no errors.
        """
        print(f"Validating configuration: {self.config_path}\n")

        if not self._load_config():
            return False

        if self.env_path:
            self._load_env()

        self._validate_structure()
        self._validate_manual_templates()

        if self.env_path:
            self._validate_env_vars()

        self._print_results()
        return len(self.errors) == 0

    def _load_config(self) -> bool:
        """Load and parse the JSON configuration file.

        Returns:
            True if the file was loaded and parsed successfully.
        """
        if not self.config_path.exists():
            self.errors.append(f"Configuration file not found: {self.config_path}")
            return False

        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                parsed_config = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON: {e}")
            return False
        except (OSError, UnicodeDecodeError) as e:
            self.errors.append(f"Unable to read configuration file: {e}")
            return False

        if not isinstance(parsed_config, dict):
            self.errors.append("Top-level JSON must be an object")
            return False

        self.config = parsed_config
        print("✓ Valid JSON structure")
        return True

    def _load_env(self) -> None:
        """Load environment variable names from a .env file.

        Parses KEY=value lines, ignoring comments and blank lines.
        """
        if not self.env_path.exists():
            self.warnings.append(f".env file not found: {self.env_path}")
            return

        try:
            with open(self.env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key = line.split('=', 1)[0].strip()
                        self.env_vars.add(key)
            print(f"✓ Loaded {len(self.env_vars)} environment variables from .env")
        except (OSError, UnicodeDecodeError) as e:
            self.warnings.append(f"Error reading .env file: {e}")

    def _validate_structure(self) -> None:
        """Validate top-level configuration structure.

        Checks for required fields and correct types for optional
        configuration sections.
        """
        required_fields = ['manual_call_templates']
        for field in required_fields:
            if field not in self.config:
                self.errors.append(f"Missing required field: {field}")

        if 'load_variables_from' in self.config:
            if not isinstance(self.config['load_variables_from'], list):
                self.errors.append("'load_variables_from' must be an array")
            else:
                for idx, loader in enumerate(self.config['load_variables_from']):
                    if not isinstance(loader, dict):
                        self.errors.append(
                            f"load_variables_from[{idx}]: must be an object"
                        )
                        continue
                    if 'variable_loader_type' not in loader:
                        self.errors.append(
                            f"load_variables_from[{idx}]: missing 'variable_loader_type'"
                        )

        if 'tool_repository' in self.config:
            if not isinstance(self.config['tool_repository'], dict):
                self.errors.append("tool_repository: must be an object")
            elif 'tool_repository_type' not in self.config['tool_repository']:
                self.errors.append("tool_repository: missing 'tool_repository_type'")

        if 'tool_search_strategy' in self.config:
            if not isinstance(self.config['tool_search_strategy'], dict):
                self.errors.append("tool_search_strategy: must be an object")
            elif 'tool_search_strategy_type' not in self.config['tool_search_strategy']:
                self.errors.append(
                    "tool_search_strategy: missing 'tool_search_strategy_type'"
                )

        if not self.errors:
            print("✓ Valid configuration structure")

    def _validate_manual_templates(self) -> None:
        """Validate the manual_call_templates array.

        Checks each template for required fields, valid naming,
        and no duplicate manual names.
        """
        if 'manual_call_templates' not in self.config:
            return

        templates = self.config['manual_call_templates']

        if not isinstance(templates, list):
            self.errors.append("'manual_call_templates' must be an array")
            return

        if len(templates) == 0:
            self.warnings.append("No manual call templates defined")
            return

        manual_names: Set[str] = set()

        for idx, template in enumerate(templates):
            if not isinstance(template, dict):
                self.errors.append(f"manual_call_templates[{idx}]: must be an object")
                continue
            self._validate_single_template(template, idx, manual_names)

        print(f"✓ Validated {len(templates)} manual call template(s)")

    def _validate_single_template(
        self, template: Dict[str, Any], idx: int, manual_names: Set[str]
    ) -> None:
        """Validate a single manual call template entry.

        Args:
            template: The template dictionary to validate.
            idx: Index position in the templates array.
            manual_names: Accumulated set of names for duplicate detection.
        """
        prefix = f"manual_call_templates[{idx}]"

        required_fields = ['name', 'call_template_type', 'config']
        for field in required_fields:
            if field not in template:
                self.errors.append(f"{prefix}: missing required field '{field}'")

        if 'name' in template:
            name = template['name']
            if not isinstance(name, str):
                self.errors.append(f"{prefix}: field 'name' must be a string")
            else:
                if not VALID_IDENTIFIER.match(name):
                    self.errors.append(
                        f"{prefix}: invalid manual name '{name}' "
                        "(must be valid JavaScript identifier: letters, digits, _, $ only)"
                    )

                if name in manual_names:
                    self.errors.append(f"{prefix}: duplicate manual name '{name}'")
                else:
                    manual_names.add(name)

                if '-' in name:
                    self.errors.append(
                        f"{prefix}: manual name '{name}' contains hyphen "
                        "(use underscores instead)"
                    )

                if ' ' in name:
                    self.errors.append(
                        f"{prefix}: manual name '{name}' contains spaces "
                        "(use underscores instead)"
                    )

        if 'call_template_type' in template:
            call_template_type = template['call_template_type']
            valid_types = ['mcp', 'http', 'cli', 'file']
            if not isinstance(call_template_type, str):
                self.errors.append(
                    f"{prefix}: field 'call_template_type' must be a string"
                )
            elif call_template_type not in valid_types:
                self.warnings.append(
                    f"{prefix}: unexpected call_template_type "
                    f"'{call_template_type}' "
                    f"(expected one of: {', '.join(valid_types)})"
                )

        if template.get('call_template_type') == 'mcp':
            self._validate_mcp_config(template.get('config', {}), prefix)

    def _validate_mcp_config(self, config: Any, prefix: str) -> None:
        """Validate MCP server configuration within a template.

        Args:
            config: The config dictionary from a manual call template.
            prefix: Context string for error message formatting.
        """
        if not isinstance(config, dict):
            self.errors.append(f"{prefix}.config: must be an object")
            return

        if 'mcpServers' not in config:
            self.errors.append(f"{prefix}.config: missing 'mcpServers'")
            return

        servers = config['mcpServers']
        if not isinstance(servers, dict):
            self.errors.append(f"{prefix}.config.mcpServers: must be an object")
            return

        for server_key, server_config in servers.items():
            server_prefix = f"{prefix}.config.mcpServers.{server_key}"

            if not isinstance(server_config, dict):
                self.errors.append(f"{server_prefix}: must be an object")
                continue

            if 'transport' not in server_config:
                self.errors.append(f"{server_prefix}: missing 'transport'")

            if server_config.get('transport') == 'stdio':
                if 'command' not in server_config:
                    self.errors.append(f"{server_prefix}: missing 'command'")
                if 'args' not in server_config:
                    self.errors.append(f"{server_prefix}: missing 'args'")
                elif not isinstance(server_config['args'], list):
                    self.errors.append(f"{server_prefix}.args: must be an array")

            elif server_config.get('transport') == 'sse':
                if 'url' not in server_config:
                    self.errors.append(f"{server_prefix}: missing 'url'")

            if 'env' in server_config and isinstance(server_config['env'], dict):
                for _env_key, env_value in server_config['env'].items():
                    if isinstance(env_value, str):
                        self._extract_env_vars(env_value, server_prefix)

    def _extract_env_vars(self, value: str, context: str) -> None:
        """Extract and track environment variable references.

        Args:
            value: String value that may contain ${VAR} references.
            context: Context string for associating variables with their source.
        """
        for match in ENV_VAR_PATTERN.finditer(value):
            var_name = match.group(1)
            self._required_env_vars.add((var_name, context))

    def _validate_env_vars(self) -> None:
        """Validate that all referenced environment variables are defined.

        Compares variables found via ${VAR} references against those
        loaded from the .env file.
        """
        if not self._required_env_vars:
            return

        missing_vars = []
        for var_name, context in self._required_env_vars:
            if var_name not in self.env_vars:
                missing_vars.append(f"  - {var_name} (referenced in {context})")

        if missing_vars:
            self.errors.append(
                "Environment variables referenced but not defined in .env:\n" +
                "\n".join(missing_vars)
            )
        else:
            print(f"✓ All {len(self._required_env_vars)} required environment variables are defined")

    def _print_results(self) -> None:
        """Print validation summary with errors and warnings."""
        print("\n" + "=" * 70)

        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):\n")
            for warning in self.warnings:
                print(f"  • {warning}")

        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):\n")
            for error in self.errors:
                print(f"  • {error}")
            print("\n" + "=" * 70)
            print("❌ VALIDATION FAILED")
        else:
            print("\n✅ VALIDATION PASSED")
            if self.warnings:
                print(f"   ({len(self.warnings)} warning(s))")

        print("=" * 70)


# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    """Parse CLI arguments and run configuration validation."""
    parser = argparse.ArgumentParser(
        description="Validate a Code Mode .utcp_config.json file."
    )
    parser.add_argument(
        'config_path',
        help="Path to .utcp_config.json",
    )
    parser.add_argument(
        '--check-env',
        dest='env_path',
        help="Optional path to .env file for environment variable validation",
    )
    args = parser.parse_args()

    validator = ConfigValidator(args.config_path, args.env_path)
    success = validator.validate()

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
