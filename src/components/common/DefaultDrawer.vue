<template>
    <el-drawer v-model="props.darwer" :direction="props.direction" :before-close="handleClose" :size="props.size">
        <template #header>
          <h4>{{ props.title }}</h4>
        </template>
        <template #default>
          <slot />
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick">cancel</el-button>
          </div>
        </template>
      </el-drawer>
</template>
<script setup>
import {ref,computed,defineProps} from 'vue';
import {useStore} from 'vuex'
    const store = useStore();
    const props = defineProps(['darwer','direction','title','size'])
    function cancelClick(){
        store.commit('reverseDefaultDrawerVisible');
    }

    function handleClose(done){
        store.commit('reverseDefaultDrawerVisible');
        done();
    }
</script>