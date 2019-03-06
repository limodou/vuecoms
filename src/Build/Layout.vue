<template>
  <component v-if="boxComponent" :is="boxComponent" :title="title" v-bind="boxOptions" class="u-layout">
    <Row v-for="(row, i) in rows" class="u-layout-row" :key="i">
      <Col v-for="(col, j) in row" :span="col.colspan" :key="j">
        <FormCell v-if="!col.hidden" :col="col" :value="value" :validateResult="validateResult"
          :labelDir="labelDir"
          :staticSuffix="staticSuffix" root="Build"></FormCell>
      </Col>
    </Row>
    <Row v-if="buttons" slot="footer">
      <Buttons :buttons="btns" :data="value" :size="size" :target="$parent"></Buttons>
    </Row>
  </component>
  <div v-else class="u-layout">
    <Row v-for="(row, i) in rows" class="u-layout-row" :key="i">
      <Col v-for="(col, j) in row" :span="col.colspan" :key="j">
        <FormCell v-if="!col.hidden" :col="col" :value="value" :validateResult="validateResult" 
          :labelDir="labelDir"
          :staticSuffix="staticSuffix" :root="Build"></FormCell>
      </Col>
    </Row>
  </div>
</template>

<script>
import FormCell from './FormCell'
import layoutMixin from './layoutMixin'
import {Row, Col} from 'iview'
import Buttons from '../Table/UButtons'

export default {
  name: 'BuildLayout',
  components: {
    FormCell,
    Row,
    Col,
    Buttons
  },
  mixins: [layoutMixin]
}
</script>

<style lang="less">

.u-layout-row {
  min-height: 34px;
  padding-bottom: 4px;
  margin-bottom: 12px;

  &:after {
    content: "";
/*      display: block; */
    height: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden
  }
}

.u-layout-cell-label {
  display: table-cell;
  text-align: right;
  margin-right: 10px;
  vertical-align: top;
  height: 28px;
  line-height: 28px;
  font-weight: bold;
  margin-bottom: 0;
  padding-right: 10px;
  font-size: 14px;

  &:after {
    content: ":";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: black;
  }
}

.u-layout-cell-field {
  display: table-cell;
  width: 2000px;
  vertical-align: middle;
  /* border-bottom: 1px solid #ccc; */

  .u-generic-input-text {
    font-size: 14px;
    color: #333;
  }

  .u-layout-cell-help {
    display: block;
    color: #9ea7b4;
    font-size: 12px;
    margin-top: 5px;
    margin-left: 2px;
  }
}

.u-layout-compact {
  .u-layout-cell-label {
    display: inline-block;
    margin-right: 0px;
    padding-right: 0px;
  }

  .u-layout-cell-field {
    display: inline-block;
    margin-right: 10px;
  }
}

.u-layout-required {
  .u-layout-cell-label:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}

.u-layout-error {
  .u-layout-cell-error {
    display: block;
    color: #ed3f14;
    font-size: 12px;
    margin-top: 5px;
    margin-left: 2px;
  }

  .ivu-input, .ivu-select-selection, .vue-treeselect__control {
    border: 1px solid #ed3f14;
  }
}
</style>
