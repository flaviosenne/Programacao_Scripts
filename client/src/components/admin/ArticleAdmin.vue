<template>
  <div class="article-admin">
    <b-form>
      <input id="article-id" type="hidden" v-model="article.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="article-name">
            <b-form-input
              :readonly ="mode == 'remove'"
              id="article-name"
              type="text"
              v-model="article.name"
              required
              placeholder="Informe o Nome do artigo..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Descrição:" label-for="article-description">
            <b-form-input
              :readonly ="mode == 'remove'"
              id="article-description"
              type="text"
              v-model="article.description"
              required
              placeholder="Informe a descrição do artigo..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Imagem:" label-for="article-image">
            <b-form-input
              :readonly ="mode == 'remove'"
              id="article-image"
              type="text"
              v-model="article.imageUrl"
              required
              placeholder="Insira a url da imagem para o artigo..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row  v-show="mode === 'save'">
        <b-col xs="12">
          <b-form-group label="Categorias" label-for="article-parentId">
            <b-form-select
              id="article-categoryId"
              :options="categories"
              v-model="article.categoryId"
            />
          </b-form-group>

          <b-form-group label="Autor" label-for="article-userId">
            <b-form-select
              id="article-userId"
              :options="users"
              v-model="article.userId"
            />
          </b-form-group>

           <b-form-group label="Conteudo" label-for="category-content">
            <VueEditor v-model="article.content"
            placeholder="Informe o conteúdo do artigo"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" v-if="mode === 'save'" @click="save"
            >Salvar</b-button
          >
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove"
            >Excluir</b-button
          >
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <b-table hover striped :items="articles" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button
          variant="warning"
          @click="loadarticle(data.item)"
          class="mr-2"
        >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button
          variant="danger"
          @click="loadarticle(data.item, 'remove')"
          class="mr-2"
        >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination size ="md" v-model="page"
    :total-rows="count" :per-page="limit"/>
  </div>
</template>

<script>
import { VueEditor} from 'vue2-editor'
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

export default {
  name: "ArticleAdmin",
  components: {VueEditor},
  data: function () {
    return {
      mode: "save",
      article: {},
      articles: [],
      categories: [],
      users: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "description", label: "Descrição", sortable: true },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  methods: {
    loadarticles() {
      const url = `${baseApiUrl}/articles?page=${this.page}`;
      axios.get(url).then((res) => {
        console.log(res.data)
        this.articles = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
        });
    },
    reset() {
      this.mode = "save";
      this.article = {};
      this.loadarticles();
    },
    save() {
      const method = this.article.id ? "put" : "post";
      const id = this.article.id ? `/${this.article.id}` : "";
      axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadarticle(article, mode = "save") {
      this.mode = mode;
      axios.get(`${baseApiUrl}/articles/${article.id}`).then(res => {
        this.article = res.data
      })
    },
    remove() {
      const id = this.article.id;
      axios
        .delete(`${baseApiUrl}/articles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadCategories(){
      const url = `${baseApiUrl}/categories`
      axios.get(url).then(res => {
        this.categories = res.data.map(category => {
          return {value: category.id, text: category.path}
        })
      })
    },
    loadUsers(){
      const url = `${baseApiUrl}/users`
      axios.get(url).then(res => {
        this.users = res.data.map(user => {
          return {value: user.id, text: `${user.name} - ${user.email}`}
        })
      })
    }
  },
  watch:{
    page(){
      this.loadarticles()
    }
  },
  mounted() {
    this.loadarticles();
    this.loadCategories();
    this.loadUsers();
  },
};
</script>

<style>
</style>