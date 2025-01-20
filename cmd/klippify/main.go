package main

import (
	"coura/klippify/internal/http/resources/files"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.LoadHTMLGlob("web/template/*")

	r.Static("/web/static", "web/static/")

	r.POST("/files/read", files.ReadFile)
	r.GET("/", files.RenderMainPage)

	r.Run()
}
