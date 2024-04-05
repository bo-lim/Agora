<template>
    <div class="body">
        <div>
            <signup-login-form></signup-login-form>
        </div>
    </div>
</template>

<script>
import SignupLoginForm from './SignupLoginForm.vue'
export default {
    components: { SignupLoginForm },

}
</script>

<style>
.body {
    margin: 0;
    padding: 0;
    background-color: #E5E5E5;
    /* 배경 색 설정 */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>