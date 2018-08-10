import Vuex from 'vuex';

import files from 'simput/src/stores/files';
import templates from 'simput/src/stores/templates';
import properties from 'simput/src/stores/properties';
import widgets from 'simput/src/stores/widgets';

function createStore() {
  return new Vuex.Store({
    state: {
      route: 'landing', // valid values: landing, app
      panels: {},
    },
    modules: {
      files,
      templates,
      properties,
      widgets,
    },
    mutations: {
      SHOW_LANDING(state) {
        state.route = 'landing';
      },
      SHOW_APP(state) {
        state.route = 'app';
      },
    },
    actions: {},
  });
}

export default createStore;