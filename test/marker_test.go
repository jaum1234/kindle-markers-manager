package test

import (
	"coura/kindlemanager/internal/marker"
	"testing"
)

func TestExtractPositions(t *testing.T) {
	tests := []struct {
		name       string
		l          string
		start, end string
	}{
		{"Should extract the positions 1011 and 1013", "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", "1011", "1013"},
		{"Should extract the positions 1 and 3", "Seu destaque na página 66 | posição 1-3 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", "1", "3"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			start, end := marker.ExtractPositions(tt.l)

			if start != tt.start || end != tt.end {
				t.Errorf("Expected %s-%s, got %s-%s", tt.start, tt.end, start, end)
			}
		})
	}
}

func TestCalculateTimestamp(t *testing.T) {
	tests := []struct {
		name     string
		l        string
		expected int64
	}{
		{"Should calculate the timestamp 1729531945", "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25", 1729531945},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := marker.CalculateTimestamp(tt.l)

			if result != tt.expected {
				t.Errorf("Expected %d, got %d", tt.expected, result)
			}
		})
	}
}
