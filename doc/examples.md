# 示例

## Box

### 基本用法

{% tabs %}

-- Result --

展示一块区域

{% include-code %}
<div id="ex01">
  <Box title="这是标题">
    <p>这是内容</p>
    <p>这是内容</p>
    <p>这是内容</p>
    <p>这是内容</p>
  </Box>
</div>
<script>
var ex01 = new Vue({
  el: '#ex01'
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex01 = new Vue({
  el: '#ex01'
})
```

-- HTML --

```
<Box title="这是标题">
  <p>这是内容</p>
  <p>这是内容</p>
  <p>这是内容</p>
  <p>这是内容</p>
</Box>
```

{% endtabs %}
