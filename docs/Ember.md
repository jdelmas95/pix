# Ember.js

### Sommaire

1. [Routes](#routes)
   * [Le fichier `router.js`](#le-fichier-routerjs)
   * [Utilisation de transitionTo](#utilisation-de-transitionto)

2. [Tests](#tests)
  * [Stubber un service](#stubber-un-service)


## Routes

### Le fichier `router.js`

Voici des conventions à respecter dans le fichier `router.js`, qui est le fichier contenant les déclarations des routes de l'application :
*  Préfixer le `path` d'une route par un caractère `/`

```javascript
// BAD
this.route('sessions', function() {
  this.route('index', { path: '' });
  this.route('list', { path: 'liste' });
  this.route('update', { path: ':session_id/modification' });
});

// GOOD
this.route('sessions', function() {
  this.route('index', { path: '/' });
  this.route('list', { path: '/liste' });
  this.route('update', { path: '/:session_id/modification' });
});
```

*  Positionner la route "absorbe-tout" du router en dernière position. Cette route permet de capter les visites d'un utilisateur vers des routes qui n'existent pas :

```javascript
// BAD
Router.map(function() {
  this.route('login', { path: '/connexion' });
  this.route('not-found', { path: '/*path' });
  this.route('logout', { path: '/deconnexion' });

  this.route('authenticated', { path: '/' }, function () {
    /* ... */
  });
});

// GOOD
Router.map(function() {
  this.route('login', { path: '/connexion' });
  this.route('logout', { path: '/deconnexion' });

  this.route('authenticated', { path: '/' }, function () {
    /* ... */
  });
  
  this.route('not-found', { path: '/*path' });
});
```

* Déclarer explicitement la route `index` de chaque groupe de routes :

Dans **Ember**, toutes les routes "parentes" présentent une route à la racine, appelée la route `index`.
Qu'elle soit explicitement déclarée ou pas, elle existera toujours. On s'efforcera donc d'éviter le code _magique_ et de la déclarer explicitement à chaque fois.
Cela permet de rendre l'ensemble du code plus lisible, mais aussi d'éviter les oublis de rendus ou de redirection sur ces routes `index`.
La route faisant office d'`index` au sein d'un groupe de routes est celle dont le `path` vaut '`/`'.

```javascript
// BAD
this.route('assessment', { path: '/:campaign_participation_id' }, function() {
  this.route('results', { path: '/resultats' });
  this.route('analysis', { path: '/analyse' });
});

// GOOD N°1 : Index route is called index
this.route('assessment', { path: '/:campaign_participation_id' }, function() {
  this.route('index', { path: '/' });
  this.route('results', { path: '/resultats' });
  this.route('analysis', { path: '/analyse' });
});

// GOOD N°2 : We want to name index route differently
this.route('assessment', { path: '/:campaign_participation_id' }, function() {
  this.route('details', { path: '/' });
  this.route('results', { path: '/resultats' });
  this.route('analysis', { path: '/analyse' });
});
```

### Utilisation de transitionTo

Éviter les `transistionTo` dans le hook `model()`. Privilégier leur utilisation dans l’`afterModel()`, une fois que le modèle est chargé.

```javascript
// BAD
export default class MyRoute extends Route {
  async model(params) {
    const user = await this.store.findRecord('user', params.user_id);
    if (user.isHappy) {
      return this.transitionTo('happy_place');
    }
    return user;
  }
};

// GOOD
export default class MyRoute extends Route {
  model(params) {
    return this.store.findRecord('user', params.user_id);
  }

  afterModel(model) {
    if (model.isHappy) {
      return this.transitionTo('happy_place');
    }
  }
}
```

## Tests

### Stubber un service

On exploite l'injection des services dans Ember afin de tester correctement les modules qui en utilisent.

```javascript
// components/login-form.js
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class LoginForm extends Component {
  @service session;
  @tracked printSuccessMessage = false;
  email = null;
  
  @action
  async authenticate(event) {
    await this.session.authenticate('authenticator:oauth2', email, 'pix123', 'pix-orga');
    this.printSuccessMessage = true;
  }
}
```
```handlebars
{{!-- components/login-form.hbs --}}
<form {{on 'submit' this.authenticate}}>
  <label for="login-email">Adresse e-mail</label>
  <Input
    @id="login-email"
    @name="login"
    @type="email"
    @value={{this.email}}
    @required='true'
  />

  <div>
    <button type="submit">Je me connecte</button>
  </div>
  {{#if this.printSuccessMessage}}
    <p>Bravo !</p>
  {{/if}}
</form>
```
```javascript
// tests/integration/components/login-form.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | login-form', function(hooks) {
  setupRenderingTest(hooks);
  
  test('it should display success message when authentication is successful', async function(assert) {
    const authenticateStub = sinon.stub();
    class SessionStub extends Service {
      authenticate = authenticateStub;
    }
    authenticateStub
      .withArgs('authenticator:oauth2', 'pix@example.net', 'pix123', 'pix-orga')
      .resolves();
    this.owner.register('service:session', SessionStub);
    await render(hbs`<Routes::LoginForm/>`);

    // when
    await fillIn('#login-email', 'pix@example.net');
    await click('.button');

    // then
    assert.contains('Bravo !');
  });
});
```


