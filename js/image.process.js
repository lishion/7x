/**
 * Created by java-dev-02 on 2017/8/17.
 */

function Gaussian_blur(data, width, height, radius, sigma) {
    var gaussMatrix = [],
        gaussSum = 0,
        x, y,
        r, g, b, a,
        i, j, k, len;

    radius = Math.floor(radius) || 3;

    sigma = sigma || radius / 3;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;

    }

    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
    }

    //x方向
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = x + j;
                //a = j + row;
                if (k >= 0 && k < width) { //确保 k 没超出 x 的范围

                    i = (y * width + k) * 4;
                    r += data[i] * gaussMatrix[j + radius];
                    g += data[i + 1] * gaussMatrix[j + radius];
                    b += data[i + 2] * gaussMatrix[j + radius];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;

            data[i] = r / gaussSum;
            data[i + 1] = g / gaussSum;
            data[i + 2] = b / gaussSum;
        }
    }
    //y方向
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = y + j;
                if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
                    i = (k * width + x) * 4;
                    r += data[i] * gaussMatrix[j + radius];
                    g += data[i + 1] * gaussMatrix[j + radius];
                    b += data[i + 2] * gaussMatrix[j + radius];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            data[i] = r / gaussSum;
            data[i + 1] = g / gaussSum;
            data[i + 2] = b / gaussSum;

        }
    }

    return data;
}

function onSuccess(image,callback){
    var timer = setInterval(function () {
        if(image.complete == true){
            callback();
            clearInterval(timer);
        }
    },100);
}

function drawBlur(url) {
    var img = new Image();
    img.src=url;

    onSuccess(img,function () {
        var data;
        var canvas = document.createElement("canvas"); //创建canvas元素
        var width=img.width; //确保canvas的尺寸和图片一样
        var height=img.height;

        canvas.width=width;
        canvas.height=height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0,width,height); //将图片绘制到canvas中
        data = ctx.getImageData(0,0,width,height);
        data.data = Gaussian_blur(data.data,width,height,10,100);
        ctx.putImageData(data,0,0);
        var dataURL = canvas.toDataURL('image/jpeg'); //转换图片为dataURL
        document.body.style.background="url("+dataURL+")";
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.style.backgroundSize = "100% 130%"
        refreshPic();
    })
}
var now_index = 1;
var now_index_grop = 1;

function getUrl(index,index_grop) {
    return "img/"+index_grop + "/" + index + ".jpg";
}

function drawBlurIndex() {
    drawBlur(getUrl(now_index,now_index_grop));
}
drawBlurIndex();

function refreshPic() {
    $("#content").find("img").prop("src",getUrl(now_index,now_index_grop));
}

$("#tab-l").click(function () {

    if(now_index>1){
        now_index--;
        drawBlurIndex();

    }

});

$("#tab-r").click(function () {
    var x = $(".selected").attr("data-max");
    if(now_index<x){
        now_index++;
        drawBlurIndex();

    }
});