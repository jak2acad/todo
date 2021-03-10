<template>
  <div class="text-subtitle-1 ml-4"> {{ livedate }} </div>
</template>

<script>
import { format } from 'date-fns'
export default {
    data() {
        return {
            livedate: ''
        }
    },
    methods: {
        getDate() {
            this.livedate = format(new Date(), 'MMMM d, H:mm:ss')
            setTimeout(
                this.getDate,
                1000
            )
        }
    },
    mounted() {
        this.getDate();
    }
};
</script>

<style>
</style>