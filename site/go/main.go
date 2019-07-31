package main

import (
	"flag"
	"github.com/OpenCircuits/OpenCircuits/site/go/api"
	"github.com/OpenCircuits/OpenCircuits/site/go/auth"
	"github.com/OpenCircuits/OpenCircuits/site/go/auth/google"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/utils"
	"github.com/OpenCircuits/OpenCircuits/site/go/web"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

func main() {
    // Parse flags
	googleAuthConfig := flag.String("google_auth", "", "<path-to-config>; Enables google sign-in API login")
	noAuthConfig := flag.Bool("no_auth", false, "Enables username-only authentication for testing and development")
	storagePtr := flag.String("interface", "sqlite", "The storage interface")
	pathPtr := flag.String("dbPath", "circuits.db", "The path to the database file (sqlite only)")
	flag.Parse()

    // Register authentication method
	authManager := auth.AuthenticationManager{}
	if *googleAuthConfig != "" {
		authManager.RegisterAuthenticationMethod(google.New(*googleAuthConfig))
	}
	if *noAuthConfig {
		authManager.RegisterAuthenticationMethod(auth.NewNoAuth())
	}

	// Set up the storage interface
	var storageInterface interfaces.CircuitStorageInterfaceFactory
	if *storagePtr == "mem" {
		storageInterface = &storage.MemCircuitStorageInterfaceFactory{}
	} else if *storagePtr == "sqlite" {
		storageInterface = &storage.SqliteCircuitStorageInterfaceFactory{Path: *pathPtr}
	}
	core.SetCircuitStorageInterfaceFactory(storageInterface)

    // Route through Gin
	router := gin.Default()
	router.Use(gin.Recovery())

	// Generate CSRF Token...
	store := sessions.NewCookieStore([]byte(utils.RandToken(64)))
	store.Options(sessions.Options{
		Path:   "/",
		MaxAge: 60 * 60 * 24 * 7,
	})
	router.Use(sessions.Sessions("opencircuitssession", store))

    // Register pages
	web.RegisterPages(router, authManager)
	authManager.RegisterHandlers(router)
	api.RegisterHandlers(router, authManager)

	// TODO: add flags for this
	router.Run("127.0.0.1:8080")
}
