import Vue from "vue";
import Vuex from "vuex";
import Localbase from "localbase";

let db = new Localbase("db");
db.config.debug = false

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    search: null,
    tasks: [
      /*       { id: 1, title: "Wake up", done: false, dueDate: '2020-10-16' },
      { id: 2, title: "Get bananas", done: false, dueDate: '2020-10-17' },
      { id: 3, title: "Eat bananas", done: false, dueDate: null }, */
    ],
    snackbar: {
      show: false,
      text: "Operation done!",
    },
    sorting: false,
  },
  mutations: {
    setSearch(state, value) {
      state.search = value;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, newTask) {
      state.tasks.push(newTask);
    },
    doneTask(state, id) {
      let task = state.tasks.filter((task) => task.id === id);
      if (task.length > 0) {
        task[0].done = !task[0].done;
      }
    },
    deleteTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
    updateTaskTitle(state, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id);
      if (task.length > 0) {
        task[0].title = payload.title;
      }
    },
    updateTaskDueDate(state, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id);
      if (task.length > 0) {
        task[0].dueDate = payload.dueDate;
      }
    },
    showSnackBar(state, text) {
      let timeout = 0;
      if (state.snackbar.show) {
        state.snackbar.show = false;
        timeout = 300;
      }
      setTimeout(() => {
        state.snackbar.show = true;
        state.snackbar.text = text;
      }, timeout);
    },
    hideSnackbar(state) {
      state.snackbar.show = false;
    },
    toggleSorting(state) {
      state.sorting = !state.sorting;
    },
  },
  actions: {
    addTask({ commit }, newTaskTitle) {
      let newTask = {
        id: Date.now(),
        title: newTaskTitle,
        done: false,
        dueDate: null,
      };
      db.collection("tasks")
        .add(newTask)
        .then(() => {
          commit("addTask", newTask);
          commit("showSnackBar", "Task added");
        });
    },
    doneTask({ state, commit }, id) {
      let task = state.tasks.filter((task) => task.id === id);
      db.collection("tasks").doc({ id }).update({
        done: !task.done
      }).then(() => {
        commit("doneTask", id)
      })
    },
    deleteTask({ commit }, id) {
      db.collection('tasks').doc({ id }).delete().then(() => {
        commit("deleteTask", id);
        commit("showSnackBar", "Task deleted");
      })
    },
    updateTaskTitle({ state, commit }, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id);
      db.collection("tasks").doc({ id: payload.id }).update({
        title: task.title
      }).then(() => {
        commit("updateTaskTitle", payload);
        commit("showSnackBar", "Task updated!");
      })
    },
    updateTaskDueDate({ state, commit }, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id);
      db.collection("tasks").doc({ id: payload.id }).update({
        dueDate: task.dueDate
      }).then(() => {
        commit("updateTaskDueDate", payload);
        commit("showSnackBar", "Task updated!");
      })
    },
    setTasks({ commit }, tasks) {
      db.collection('tasks').set(tasks);/* .then(() => {
        commit("setTasks", tasks);
      }) */
      // to avoid affecting the dragging experience that waits for localbase commit
      commit("setTasks", tasks);
    },
    getTasks({ commit }) {
      db.collection("tasks")
        .get()
        .then((tasks) => {
          commit("setTasks", tasks);
        });
    },
  },
  getters: {
    taskFiltered(state) {
      if (!state.search) {
        return state.tasks;
      }
      return state.tasks.filter((task) =>
        state.search && task.title && task.title.toLowerCase().includes(state.search.toLowerCase())
      );
    },
  },
  /*   modules: {
  } */
});
