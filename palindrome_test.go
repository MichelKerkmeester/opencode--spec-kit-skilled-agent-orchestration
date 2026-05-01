package cp026

import "testing"

func TestIsPalindrome(t *testing.T) {
  cases := []struct{ in string; want bool }{
    {"racecar", true},
    {"hello", false},
    {"a", true},
    {"", true},
  }
  for _, c := range cases {
    if got := IsPalindrome(c.in); got != c.want {
      t.Errorf("IsPalindrome(%q) = %v, want %v", c.in, got, c.want)
    }
  }
}
