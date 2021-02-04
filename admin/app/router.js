import EmberRouter from '@ember/routing/router';
import config from 'pix-admin/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  constructor() {
    super(...arguments);
    this.on('routeDidChange', () => {
      window.scrollTo(0, 0);
    });
  }
}

Router.map(function() {
  this.route('login', { path: '/connexion' });
  this.route('logout', { path: '/deconnexion' });

  // public routes
  this.route('index');
  this.route('about');

  this.route('authenticated', { path: '/' }, function() {
    this.route('organizations', { path: '/organisations' }, function() {
      this.route('list');
      this.route('new', { path: '/creation' });
      this.route('get', { path: '/:organization_id' }, function() {
        this.route('members', { path: '/membres' });
        this.route('target-profiles', { path: '/profils-cibles' });
      });
    });

    this.route('users', { path: '/utilisateurs' }, function() {
      this.route('list');
      this.route('get', { path: '/:user_id' });
    });

    this.route('certification-centers', { path: '/centres-de-certification' }, function() {
      this.route('list');
      this.route('new', { path: '/creation' });
      this.route('get', { path: '/:certification_center_id' });
    });

    this.route('sessions', function() {
      this.route('list');
      this.route('session', { path: '/:session_id' }, function() {
        this.route('informations', { path: '/' });
        this.route('certifications');
      });
    });

    this.route('certifications', function() {
      this.route('certification', { path: '/:certification_id' }, function() {
        this.route('informations', { path: '/' });
        this.route('details');
      });
    });

    this.route('target-profiles', { path: '/profils-cibles' }, function() {
      this.route('list');
      this.route('new', { path: '/creation' });
      this.route('target-profile', { path: '/:target_profile_id' }, function() {
        this.route('details', { path: '/' });
        this.route('organizations', { path: '/organisations' });
        this.route('badges');
      });
    });

    this.route('tools', { path: '/outils' });
  });
});
