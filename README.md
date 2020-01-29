Mercredi :-(
1. Razzle

Plus tard :
1. simplifier un peu la chaîne côté commandHandler/Objet métier/Repository
2. Avoir une meilleure sauvegarde sur disque (fichier en écriture seule) au lieu de la sérialisation JSON actuelle
3. renforcer par les types pour avoir le middleware commande->eventBus en avant-dernier et le `CommandDispatcher` en dernier

1. (2) HTTP Post (Fastify : https://github.com/fastify/fastify/blob/master/docs/Getting-Started.md ) ¿ Model View Presenter pour la remontée ?

2. (2) GraphQL (serveur : https://github.com/zalando-incubator/graphql-jit, client : https://github.com/FormidableLabs/urql/blob/master/README.md )
4. Postgres pour la sauvegarde des événements
5. Redis pour la mise en cache des ViewModels
