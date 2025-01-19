package test

import (
	"coura/kindlemanager/internal/utils"
	"testing"
)

func TestMatchOrUnknown(t *testing.T) {
	str, ptr := "Hello, World!", "World"
	expected := "World"

	result := utils.MatchOrUnknown(str, ptr)

	if result != expected {
		t.Errorf("Expected %s, got %s", expected, result)
	}

	str, ptr = "Hello, World!", "Dog"
	expected = utils.UNKNOWN

	result = utils.MatchOrUnknown(str, ptr)

	if result != expected {
		t.Errorf("Expected %s, got %s", expected, result)
	}
}
