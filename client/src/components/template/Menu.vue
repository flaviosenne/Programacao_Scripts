<template>
  <aside class="menu" v-show="isMenuVisible">
      <div class="menu-filter">
          <i class = "fa fa-search fa-lg"></i>
          <input type="text"
          placeholder="digite para filtrar..."
          v-mode="treeFilter" class="filter-field">
      </div>
      <Tree :data="treeData" :options="treeOptions"
      :filter="treeFilter" ref="tree" />
  </aside>
</template>

<script>

import { mapState } from 'vuex'
import Tree from 'liquor-tree'
import { baseApiUrl} from '@/global'
import axios from 'axios'
export default {
    name: 'Menu',
    computed: mapState(['isMenuVisible']),
    components: {Tree},
    data: function(){
        return{
            treeFilter: '',
            treeData: this.getTreeData(),
            treeOptions: {
                propertyName: {'text': 'name'},
                filter: {emptyText: 'Categoria não encontrada'}
            }
        }
    },
    methods: {
        getTreeData(){
            const url = `${baseApiUrl}/categories/tree`
            return axios(url).then(res => res.data)
        }
    }
}
</script>

<style>
    .menu {
        grid-area: menu;
        background: linear-gradient(to right, #232526, #778899);
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }
    .menu a,
    menu a:hover{
        color: #fff;
        text-decoration: none;
    }
    .menu .tree-node.selected > .tree-content,
    .menu .tree-node > .tree-content:hover{
        background-color: rgba(255,255,255, 0.2);
    }
    .tree-arrow.has-child {
        filter: brightness(2);
    }
    .menu .menu-filter{
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 20px;
        padding-bottom: 8px;
        border-bottom: 1px solid #aaa;
    }
    .menu .menu-filter i {
        color: #aaa;
        margin-right: 10px;
    }

    .menu input{
        color: #ccc;
        font-size: 1.3rem;
        border:none;
        outline: none;
        width: 100%;
        background: transparent; 
    }
    .tree-filter-empty{
        color: #ccc;
        font-size: 1.3rem;
        margin-left: 20px;
    }
</style>