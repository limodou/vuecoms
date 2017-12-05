#npm run build
cp ../README.md ./index.md
branch=`git branch|grep '*'`
if [ "$branch" = "* gh-pages" ]; then
  dir=..
else
  dir=../html
fi
if [ ! -d "$dir/static" ]; then
  mkdir -p $dir/static
fi
#cp examples.js $dir/static
cp ../dist/static/css/vuecoms.css $dir/static
cp ../dist/static/js/vuecoms.js $dir/static
cp ../node_modules/vue/dist/vue.js $dir/static
if [ ! -d "$dir/static/iview" ]; then
  mkdir -p $dir/static/iview
fi
cp -r ../node_modules/iview/dist/* $dir/static/iview
parm make -d $dir
