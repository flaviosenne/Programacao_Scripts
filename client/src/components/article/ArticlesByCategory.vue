<template>
    <div class="articles-by-category">
        <PageTitle :main="category.name" 
        icon="fa fa-folder-o"
        sub="Categoria"/>
    </div>
</template>

<script>

import axios from 'axios'
import {baseApiUrl} from '@/global'
import PageTitle from '../template/PageTitle' 

export default {
 name: 'ArticlesByCategory',
 components: {PageTitle},
 data() {
    return{
        category: {},
        articles: [],
        page: 1,
        loadMore: true
    }  
 },
 methods: {
     getCategory(){
         const url = `${baseApiUrl}/categories/${this.category.id}/articles`
         axios.get(url).then(res => {
             console.log(res.data)
             this.category = res.data
             })
     }
 },
 mounted() {
     this.category.id = this.$route.params.id
     this.getCategory()
 }
}
</script>

<style scoped>

</style>