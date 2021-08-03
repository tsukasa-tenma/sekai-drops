var itemList = ["miragem", "cloth", "thread", "seed"];
var itemListSF = ["coin", "score", "miragem", "cloth", "thread", "seed"];
var itemsOn, itemSF;
var userId;

const formUrl = "https://script.google.com/macros/s/AKfycby7_G5beaEoafWuxZz5rstADUL0srYUYcAd3eXEm6mQxVGl9thHiEpfGKZ-ULhJocm29g/exec";

$(function () {
    initItems();
    loadId();
});

function loadId() {
    let id = localStorage.getItem("sekai-drop-id");
    if (!id) {
        id = "";
        let alpha = "0123456789abcdef"
        for (var i=0; i<16; i++) {
            id += alpha[Math.floor(Math.random() * 16)];
        }
        localStorage.setItem("sekai-drop-id", id);
    }
    userId = id;
}

function initItems() {
    initItemsRow("#itemsMain", itemList, false, 0);
    initItemsRow("#itemsSF", itemListSF, true, itemList.length);
    itemsOn = [];
    for (let i=0; i<itemList.length; i++) {
        itemsOn.push(false);
    }
    itemSF = -1;
}

function initItemsRow(selector, items, isSF, tabIndex) {
    $(selector).empty();
    for (let i = 0; i < items.length; i++) {
        $(selector).append(`<img class="${isSF ? "itemSF" : "item"} gray" tabindex=${0} item-id="${i}" draggable="false" onclick="itemClick(${i}, ${isSF})" src="./img/${items[i]}.png">`);
    }
}

function itemClick(id, isSF) {
    if (isSF) {
        if (id == itemSF) {
            itemSF = -1;
        } else {
            itemSF = id;
        }
    } else {
        itemsOn[id] = !itemsOn[id];
    }
    updateItems();
}

function clearItems() {
    for (let i = 0; i < itemsOn.length; i++) {
        itemsOn[i] = false;
    }
    itemSF = -1;
    updateItems();
}

function updateItems() {
    for (let i = 0; i < itemsOn.length; i++) {
        let itemDiv = $(`.item[item-id="${i}"]`);
        if (itemsOn[i]) {
            itemDiv.removeClass("gray");
        } else {
            itemDiv.addClass("gray");
        }
    }
    $(`.itemSF`).addClass("gray");
    if (itemSF > -1) {
        $(`.itemSF[item-id="${itemSF}"]`).removeClass("gray");
    }
}

async function submit() {
    $("#submit").hide();
    setTimeout(function() {
        $("#submit").show();
        $("#success").hide();
        $("#error").hide();
    }, 60000);
    var data = {
        "time": new Date().toString(),
        "userid": userId 
    };
    for (let i=0; i<itemList.length; i++) {
        data[itemList[i]] = itemsOn[i] ? 1 : 0;
    }
    for (let i=0; i<itemListSF.length; i++) {
        data["sf" + itemListSF[i]] = itemSF == i ? 1 : 0;
    }
    var jqxhr = await $.ajax({
        url: formUrl,
        method: "GET",
        dataType: "json",
        data: data
    });
    if (jqxhr.result == "success") {
        $("#success").show();
    }
    else {
        $("#error").show();
    }
    clearItems();
}
