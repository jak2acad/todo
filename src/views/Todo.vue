<template>
  <div class="home">


    <list-tasks v-if="$store.state.tasks.length" />

    <no-tasks v-else />

    <button-done-sorting 
    v-if="$store.state.sorting"
    >
    </button-done-sorting>

  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
    "list-tasks": require("@/components/todo/ListTasks.vue").default,
    "no-tasks": require("@/components/todo/NoTasks.vue").default,
    "button-done-sorting": require("@/components/todo/ButtonDoneSorting.vue").default,
  },
};
</script>


