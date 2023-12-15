//this part of the example can be found at mapbox: https://docs.mapbox.com/mapbox-gl-js/example/simple-map/
//you will find the accessToken and the style for your map under "Share" in your specific map in mapbox studio
mapboxgl.accessToken = 'pk.eyJ1IjoiaG9uZ3FpYW5saSIsImEiOiJjbGticW84cjIwaGRjM2xvNjNrMjh4cmRyIn0.o65hBMiuqrCXY-3-bxGsUg';
var map = new mapboxgl.Map({
  container: 'map',//thi sis the div that you have mad above in html that you are now placing your map in
  style: 'mapbox://styles/hongqianli/clkz0gnx000lw01p7375xf0qf',//you will find the accessToken under "Share" in your specific map in mapbox studio
  center: [-73.96, 40.79],//the center of the map can be set to any initial value of [lng,lat]
  zoom: 11.05,//note that some layers have zoom limits - for example, streets and building footprints are not visible when zoomed out
pitch: 0, // 设置倾斜角度
bearing: 30 
});


d3.json("Data/crops_final_data_10.geojson")
            .then(function(data) {
                map.on('load', function () {
                    var languageCounts = countLanguages(data.features);
                    var languageColors = {
                    'English': '#e81e63',
                    'Spanish': '#8bc34a',
                    'Chinese': '#3f51b5',
                    'Italian': '#00bcd4',
                    'French': '#009688',
                    'Korean': '#cddc39',
                    'Russian': '#ffc107',
                    'Bengail': '#ff9800',
                    'Haitian Creole': '#ff5722'
                    };
                    drawLanguageMarkers(data.features, languageCounts, languageColors);

                    var categoryCounts = countCategories(data.features);
                    var categoryColors = {
                        'brand sign': '#e81e63',
                        'street name sign': '#9c27b0',
                        'building information sign': '#3f51b5',
                        'bus stop sign': '#03a9f4',
                        'parking regulation sign': '#00bcd4',
                        'scaffold sign': '#009688',
                        'one way sign': '#8bc34a',
                        'advertising sign': '#cddc39',
                        'for lease sign': '#ffc107',
                        'do not enter sign': '#ff9800',
                        'speed limit sign': '#ff5722',
                        'promotion sign': '#795548',
                        'direction sign': '#9e9e9e',
                        'subway sign': '#607d8b',
                        'touristic sign': '#a77be0',
                        'shop information sign': '#d128f1',
                        'street close sign': '#fe9353',
                        'school crossing sign': '#5512d9',
                        'all traffic sign': '#a16f67',
                        'dont block sign': '#6f4e62',
                    };
                    drawCategoryMarkers(data.features, categoryCounts, categoryColors);
                    drawContentMarkers(data.features); 
                });
            });

        function countLanguages(features) {
            var counts = {};
            features.forEach(function(feature) {
                var language = feature.properties['Language-full'];
                counts[language] = (counts[language] || 0) + 1;
            });
            return counts;
        }

        function drawLanguageMarkers(features, languageCounts, languageColors) {
    // 按语言分组特征
    var featuresByLanguage = {};
    features.forEach(function(feature) {
        var language = feature.properties['Language-full'];
        if (!featuresByLanguage[language]) {
            featuresByLanguage[language] = [];
        }
        featuresByLanguage[language].push(feature);
    });

    // 为每种语言创建一个图层
    Object.keys(featuresByLanguage).forEach(function(language) {
        var count = languageCounts[language];
        var size = Math.min(4 + count, 16);
        var color = languageColors[language];

        map.addLayer({
            "id": "language-" + language,
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": featuresByLanguage[language]
                }
            },
            "layout": {
                "text-field": language,
                "text-font": ["Roboto Bold", "Arial Unicode MS Bold"],
                "text-size": size,
                "text-anchor": "left", 
                "text-offset": [0.4, 0] 
            },
            "paint": {
                "text-color": color
            }
        });
    });
}

        function countCategories(features) {
            var counts = {};
            features.forEach(function(feature) {
                var category = feature.properties['Category'];
                counts[category] = (counts[category] || 0) + 1;
            });
            return counts;
        }

        function drawCategoryMarkers(features, categoryCounts, categoryColors) {
            var featuresByCategory = {};
            features.forEach(function(feature) {
                var category = feature.properties['Category'];
                if (!featuresByCategory[category]) {
                    featuresByCategory[category] = [];
                }
                featuresByCategory[category].push(feature);
            });

            Object.keys(featuresByCategory).forEach(function(category) {
                var count = categoryCounts[category];
                var size = Math.min(4 + count, 16);
                var color = categoryColors[category];

                map.addLayer({
                    "id": "category-" + category,
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": featuresByCategory[category]
                        }
                    },
                    "layout": {
                        "text-field": category,
                        "text-font": ["Roboto Bold", "Arial Unicode MS Bold"],
                        "text-size": size,
                        "text-anchor": "left",
                        "text-offset": [0.4, 0]
                    },
                    "paint": {
                        "text-color": color
                    }
                });
            });
        }

        function drawContentMarkers(features) {
    map.addLayer({
        "id": "content",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": features
            }
        },
        "layout": {
            "text-field": "{Content}",
            "text-font": ["Roboto Bold", "Arial Unicode MS Bold"],
            "text-size": 8,
            "text-anchor": "left", 
            "text-offset": [0.4, 0],
            "text-max-width": 40 
        },
        "paint": {
            "text-color": "#ffffff"
            }
    });
}

// 假设您有另一个GeoJSON线数据存储在名为 "lineData.geojson" 的文件中
d3.json("Data/broadway.geojson")
    .then(function(lineData) {
        map.addLayer({
            "id": "line-layer",
            "type": "line", // 指定图层类型为线图层
            "source": {
                "type": "geojson",
                "data": lineData
            },
            "layout": {
                // 根据您的需求设置布局属性
            },
            "paint": {
                "line-color": "#B6B6B4", // 设置线的颜色
                "line-width": 1 // 设置线的宽度
            }
        });
    });

d3.json("Data/crops_final_data_10.geojson").then(data => {
    // 计算每种语言的出现次数
    const languageCounts = data.features.reduce((acc, feature) => {
        const language = feature.properties['Language-full'];
        acc[language] = (acc[language] || 0) + 1;
        return acc;
    }, {});

    // 创建 TreeMap 需要的数据结构
    const treeData = {
        name: "Languages",
        children: Object.keys(languageCounts).map(key => ({
            name: key,
            value: languageCounts[key]
        }))
    };

    const languageColors = {
        'English': '#e81e63',
        'Spanish': '#8bc34a',
        'Chinese': '#3f51b5',
        'Italian': '#00bcd4',
        'French': '#009688',
        'Korean': '#cddc39',
        'Russian': '#ffc107',
        'Bengail': '#ff9800',
        'Haitian Creole': '#ff5722',
    };

    // 设置 TreeMap 的尺寸
    const width = 360;
    const height = 200;
    

    // 创建一个根节点
    const root = d3.hierarchy(treeData)
        .sum(d => d.value) // 使用 value 作为节点的大小
        .sort((a, b) => b.value - a.value);

    // 应用 TreeMap 布局
    d3.treemap()
        .size([width, height])
        .padding(1)
        (root);

    // 创建 SVG 元素
    const svg = d3.select("#treemap-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font", "8px sans-serif");

        const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

// 添加矩形
leaf.append("rect")
    .attr("fill", d => languageColors[d.data.name] || "grey") // 使用预设颜色或默认颜色
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0);

// 添加文本
leaf.append("text")
    .attr("x", 1)
    .attr("y", 10)
    .text(d => `${d.data.name}\n(${d.data.value})`);

    d3.json("Data/crops_final_data_10.geojson").then(data => {
    // 计算每种分类的出现次数
    const categoryCounts = data.features.reduce((acc, feature) => {
        const category = feature.properties['Category'];
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    // 创建 TreeMap 需要的数据结构
    const categoryTreeData = {
        name: "Categories",
        children: Object.keys(categoryCounts).map(key => ({
            name: key,
            value: categoryCounts[key]
        }))
    };

    const categoryColors = {
                        'brand sign': '#e81e63',
                        'street name sign': '#9c27b0',
                        'building information sign': '#3f51b5',
                        'bus stop sign': '#03a9f4',
                        'parking regulation sign': '#00bcd4',
                        'scaffold sign': '#009688',
                        'one way sign': '#8bc34a',
                        'advertising sign': '#cddc39',
                        'for lease sign': '#ffc107',
                        'do not enter sign': '#ff9800',
                        'speed limit sign': '#ff5722',
                        'promotion sign': '#795548',
                        'direction sign': '#9e9e9e',
                        'subway sign': '#607d8b',
                        'touristic sign': '#a77be0',
                        'shop information sign': '#d128f1',
                        'street close sign': '#fe9353',
                        'school crossing sign': '#5512d9',
                        'all traffic sign': '#a16f67',
                        'dont block sign': '#6f4e62',
    };

    // 设置 TreeMap 的尺寸
    const categoryWidth = 360;
    const categoryHeight = 200;

    // 创建一个根节点
    const categoryRoot = d3.hierarchy(categoryTreeData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // 应用 TreeMap 布局
    d3.treemap()
        .size([categoryWidth, categoryHeight])
        .padding(1)
        (categoryRoot);

    // 创建另一个 SVG 元素用于分类 TreeMap
    const categorySvg = d3.select("#category-treemap-container").append("svg")
    .attr("width", categoryWidth)
    .attr("height", categoryHeight)
    .style("font", "8px sans-serif");


    // 绘制每个节点
    const categoryLeaf = categorySvg.selectAll("g")
        .data(categoryRoot.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // 添加矩形
    categoryLeaf.append("rect")
        .attr("fill", d => categoryColors[d.data.name] || "grey") // 使用预设颜色或默认颜色
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    // 添加文本
    categoryLeaf.append("text")
        .attr("x", 1)
        .attr("y", 10)
        .text(d => `${d.data.name}\n(${d.data.value})`);
});

d3.json("Data/crops_final_data_10.geojson").then(data => {
    // 提取内容并进行分词处理
    let wordMap = {};
    data.features.forEach(feature => {
        const content = feature.properties['Content'];
        // 分词并计算每个词的出现次数
        content.split(/\s+/).forEach(word => {
            // 过滤条件：过滤掉长度小于等于3的词、数字以及特定的单词
            if (word.length > 3 && !/^\d+$/.test(word) && !["ONE", "WAY", "BROADWAY", "Broadway", "[212]","www.","SPEED","LIMIT"].includes(word)) {
                wordMap[word] = (wordMap[word] || 0) + 1;
            }
        });
    });

    // 将词频转换为数组
    let words = Object.keys(wordMap).map(word => {
        return {text: word, size: wordMap[word]}; // size基于出现次数
    });

    // 按词频缩放字体大小
    const maxSize = Math.max(...words.map(w => w.size));
    words = words.map(w => {
        return {text: w.text, size: 10 + (w.size / maxSize * 40)}; // 调整字体大小
    });

    const layout = d3.layout.cloud()
    .size([360, 200]) // 可以尝试增加这个尺寸以容纳更多单词
    .words(words)
    .padding(1) // 减小单词之间的间隙
    .rotate(0) // 减少或取消旋转以使布局更紧凑
    .font("Impact")
    .fontSize(d => Math.max(10, d.size)) // 设置最小字体大小以确保可读性
    .on("end", draw);

function draw(words) {
    d3.select("#wordcloud-container").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => d.size + "px")
        .style("font-family", "Impact")
        .style("fill", "white") 
        .attr("text-anchor", "middle")
        .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
        .text(d => d.text);
}


        layout.start();
    });


// Tooltip 相关代码
const tooltip = d3.select("#tooltip");

// 修改 mouseover 事件处理函数
leaf.on("mouseover", function(event, d) {
    // 确保 d 和 d.data 都是定义的
    if (d && d.data) {
        tooltip.style("opacity", 1)
            .html("Language: " + d.data.name + "<br>Count: " + d.data.value)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
    }
})
.on("mouseout", function() {
    tooltip.style("opacity", 0);
});
});



// 添加事件监听以处理复选框的变化
function toggleLayerVisibility(layerId, isVisible) {
    var visibility = isVisible ? 'visible' : 'none';
    map.setLayoutProperty(layerId, 'visibility', visibility);
}

document.querySelector('.content-toggle').addEventListener('change', function() {
    toggleLayerVisibility("content", this.checked); // 切换 "Content" 图层的可见性
});


document.querySelector('.language-toggle').addEventListener('change', function() {
    var checked = this.checked;
    document.querySelectorAll('.language-checkbox input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.checked = checked;
        var layerId = "language-" + checkbox.value;
        toggleLayerVisibility(layerId, checked);
    });
});


document.querySelector('.category-toggle').addEventListener('change', function() {
    var checked = this.checked;
    document.querySelectorAll('.category-checkbox input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.checked = checked;
        var layerId = "category-" + checkbox.value;
        toggleLayerVisibility(layerId, checked);
    });
});

document.querySelectorAll('.category-checkbox input[type="checkbox"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        var layerId = "category-" + this.value;
        toggleLayerVisibility(layerId, this.checked);
    });
});

document.querySelectorAll('.language-checkbox input[type="checkbox"]').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        var layerId = "language-" + this.value;
        toggleLayerVisibility(layerId, this.checked);
    });
});


document.getElementById('toggle-button').addEventListener('click', function() {
    var panel = document.getElementById('language-controls');
    panel.classList.toggle('collapsed');

    // 切换箭头方向
    if (panel.classList.contains('collapsed')) {
        this.innerHTML = '&#9654;'; // 右箭头符号（展开）
    } else {
        this.innerHTML = '&#9664;'; // 左箭头符号（收缩）
    }
});

document.getElementById('treemap-toggle-button').addEventListener('click', function() {
    var panel = document.getElementById('treemap');
    panel.classList.toggle('collapsed-right');

    // 切换箭头方向
    if (panel.classList.contains('collapsed-right')) {
        this.innerHTML = '&#9664;'; // 左箭头符号（展开）
    } else {
        this.innerHTML = '&#9654;'; // 右箭头符号（收缩）
    }
});

