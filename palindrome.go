package cp026

func IsPalindrome(s string) bool {
  for i := 0; i < len(s)-2; i++ {
    if s[i] != s[len(s)-1-i] {
      return false
    }
  }
  return true
}
