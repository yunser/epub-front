/* eslint-disable */

function getCoverURL(book, callback) {
    book.coverUrl().then(function (blobUrl) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var recoveredBlob = xhr.response;
            var reader = new FileReader();
            reader.onload = function () {
                callback && callback(reader.result);
            };
            reader.readAsDataURL(recoveredBlob);
        };
        xhr.open('GET', blobUrl);
        xhr.send();
    });
}

export {getCoverURL}
