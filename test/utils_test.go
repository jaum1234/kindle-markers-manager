package test

import (
	"coura/kindlemanager/internal"
	"testing"
	"time"
)

func TestMatchOrUnknown(t *testing.T) {
	str, ptr := "Hello, World!", "World"
	expected := "World"

	result := internal.MatchOrUnknown(str, ptr)

	if result != expected {
		t.Errorf("Expected %s, got %s", expected, result)
	}

	str, ptr = "Hello, World!", "Dog"
	expected = internal.UNKNOWN

	result = internal.MatchOrUnknown(str, ptr)

	if result != expected {
		t.Errorf("Expected %s, got %s", expected, result)
	}
}

func TestExtractPositions(t *testing.T) {
	l := "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25"

	start, end := internal.ExtractPositions(l)

	if start != "1011" {
		t.Errorf("Expected 1011, got %s", start)
	}

	if end != "1013" {
		t.Errorf("Expected 1013, got %s", end)
	}
}

func TestCalculateTimestamp(t *testing.T) {
	l := "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25"
	time, _ := time.Parse("2006-01-02 15:04:05", "2024-10-21 17:32:25")

	expected := int64(time.Unix())

	result := internal.CalculateTimestamp(l)

	if result != expected {
		t.Errorf("Expected %d, got %d", expected, result)
	}
}
