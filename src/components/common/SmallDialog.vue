<template>
    <el-dialog v-model="props.isVisible" :title="props.title" width="400" :before-close="handleClose">
        <slot />
    </el-dialog>
</template>

<script setup>
import { useStore } from 'vuex' ;
import { computed,ref,reactive,defineProps } from 'vue';

    const store = useStore();
    const props = defineProps(['isVisible','title']);

    function handleClose(done) {
        store.commit('reverseSmallDialogVisible')
    }

    
    
</script>

<style scoped>

</style>