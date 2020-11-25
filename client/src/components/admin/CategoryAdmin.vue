<template>
  <div class="category-admin">
    <b-form>
      <input id="category-id" type="hidden" v-model="category.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="category-name">
            <b-form-input id="category-name" type="text"
              v-model="category.name" required
              placeholder="Informe o Nome da Categoria..." />
          </b-form-group>
        </b-col>       
      </b-row>

      <b-row>
        <b-col xs="12">
          <b-button variant="primary" @click="save">Salvar</b-button>
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr>
    <b-table hover striped :items="categories" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadcategory(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="removecategory(data.item.id)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
      </template>
        
    </b-table>
    
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
  name: 'CategoryAdmin',
  data: function(){
    return{
      category:{},
      categories:[],
      fields: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações'}
      ]
    }
  },
  methods: {
    loadcategories() {
      const url = `${baseApiUrl}/categories`
      axios.get(url).then(res => {
        this.categories = res.data
      })
    },
    reset(){
      this.category = {}
      this.loadcategories()
    },
    save() {
      const method = this.category.id ? 'put' : 'post'
      const id = this.category.id ? `/${this.category.id}` : ''
      axios[method](`${baseApiUrl}/categories${id}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    loadcategory(category){
      this.category = { ...category }
    },
    removecategory(id){
      const url = `${baseApiUrl}/categories/${id}`
      axios.delete(url).then(res => {
        this.categories = res.data
      })
      this.loadcategories()
    }


  },
  mounted(){
    this.loadcategories()
  }
}
</script>

<style>

</style>