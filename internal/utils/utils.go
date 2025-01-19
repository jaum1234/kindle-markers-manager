package utils

import "github.com/dlclark/regexp2"

const UNKNOWN string = "unknown"

func MatchOrUnknown(text string, pattern string) string {
	res := regexp2.MustCompile(pattern, 1)
	matches, _ := res.FindStringMatch(text)

	if matches != nil {
		return matches.String()
	}

	return UNKNOWN
}
