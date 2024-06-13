<template>
    <div class="card" h="30" w="30" m="2" 
    :style=" {boxShadow: `var(${getCssVarName(shadow.type)})`}"
    >
        <div :style="cardContext">
            <slot/>
        </div>
    </div>
</template>

<script setup>
import {ref,reactive,defineProps} from 'vue';

    const props = defineProps(['top','marginLeft']);
    const cardContext = ref("position: relative;top:"+props.top+";margin-left:"+props.marginLeft)
    const shadow = reactive({
        name:'Basic Shadow',
        type: ''
    })
    const getCssVarName=(type) => {
        return '--el-box-shadow' + (type? '-' : '') + type;
    }
</script>
<style scoped>
.card {
    width: 600px;
    height: 400px;
    margin-left:  30%;
    margin-top:  10%;
}
</style>