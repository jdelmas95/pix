import ApplicationAdapter from './application';

export default class PublishableSessionAdapter extends ApplicationAdapter {
  urlForFindRecord(id) {
    return `${this.host}/${this.namespace}/admin/publishable-sessions/${id}`;
  }
  urlForFindAll() {
    return `${this.host}/${this.namespace}/admin/sessions/to-publish`;
  }
}
