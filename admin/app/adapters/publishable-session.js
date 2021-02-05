import ApplicationAdapter from './application';

export default class PublishableSessionAdapter extends ApplicationAdapter {
  urlForFindAll() {
    return `${this.host}/${this.namespace}/admin/sessions/to-publish`;
  }
}
