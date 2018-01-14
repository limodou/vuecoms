<template>
    <div :id="dynamicID">
        <a class="uploader-picker btn btn-primary btn-o"></a>
        <span id="urlBox"></span>
        <div class="uploader-list"></div>
    </div>
</template>
<script>
    export default {
        props: ["config"],
        data: function () {
            var dynamicID = "uploader_" + (new Date()).getTime(),
                    configuration = Object.assign({domId: "#"+dynamicID}, this.config),
                    uploader = null;
            return {
                dynamicID,
                configuration,
                uploader
            }
        },
        mounted: function () {
            this.uploader = Uploader.create(this.configuration);
        },
        methods:{
            save:function(bsnId,bsnType){
                this.uploader.save(bsnId,bsnType)
            }
        }
    }
</script>