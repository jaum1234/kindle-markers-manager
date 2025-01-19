package main

import (
	"coura/kindlemanager/internal/http/resources"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.LoadHTMLGlob("web/template/*")

	r.Static("/web/static", "web/static/")

	r.POST("/files/read", resources.ReadFile)
	r.GET("/", resources.RenderMainPage)

	r.Run()
}
