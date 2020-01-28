Mardi :-(
2. (1) faire le `CommandHandler` qui va injecter dans l’`EventBus`
8. (1) `EventStore.getAll`
9. (0,5) Sauvegarde sur disque = serialisation JSON du store
10. (1) faire les divisions (cas d’erreur par 0), multiplication, soustraction
11. (2) HTTP Post (Fastify : https://github.com/fastify/fastify/blob/master/docs/Getting-Started.md ) ¿ Model View Presenter pour la remontée ?
12. (2) GraphQL (serveur : https://github.com/zalando-incubator/graphql-jit, client : https://github.com/FormidableLabs/urql/blob/master/README.md )

Plus tard :
1. simplifier un peu la chaîne côté commandHandler/Objet métier/Repository
2. renforcer par les types pour avoir le middleware commande->eventBus en avant-dernier et le `CommandDispatcher` en dernier
3. ¿ Modifier les EventBusMiddleware pour qu’ils retourne les événements afin de faire un chaînage plus simple ?
4. Postgres pour la sauvegarde des événements
5. Redis pour la mise en cache des ViewModels
