package test

import (
	"coura/klippify/internal/utils"
	"testing"
)

func TestMatchOrUnknown(t *testing.T) {

	tests := []struct {
		name     string
		a, b     string
		expected string
	}{
		{"Should extract the string", "Hello, World!", "World", "World"},
		{"Should return 'UNKNOWN' when the string is not found", "Hello, World!", "Dog", utils.UNKNOWN},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := utils.MatchOrUnknown(tt.a, tt.b)

			if result != tt.expected {
				t.Errorf("Expected %s, got %s", tt.expected, result)
			}
		})
	}
}

