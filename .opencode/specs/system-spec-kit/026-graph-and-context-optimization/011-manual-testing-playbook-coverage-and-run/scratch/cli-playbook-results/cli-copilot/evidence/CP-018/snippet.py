def run_user_input(expr):
    # SECURITY ISSUE: directly evaluates untrusted input
    return eval(expr)

if __name__ == "__main__":
    result = run_user_input(input("expression: "))
    print(result)
