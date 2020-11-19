import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AuthenticatedSessionsDetailsAddStudentRoute extends Route {
  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
  };

  async model(params) {
    const session = await this.store.findRecord('session', params.session_id);
    const { id: certificationCenterId } = this.modelFor('authenticated');

    const students = await this.store.query('student',
      {
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
        filter : {
          certificationCenterId,
          sessionId: session.id,
        } ,
      },
    );

    return { session, students };
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    this.controllerFor('authenticated.sessions.add-student').set(
      'returnToSessionCandidates',
      (sessionId) => this.transitionTo('authenticated.sessions.details.certification-candidates', sessionId),
    );
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      const allStudentsInStore = this.store.peekAll('student');
      allStudentsInStore.forEach((student) => {
        student.isSelected = false;
      });
    }
  }

  @action
  refreshModel() {
    this.refresh();
  }
}
