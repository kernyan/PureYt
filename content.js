let bannedRegex = [];
let bannedChannels = [];
let bannedIds = [];
let bannedTags = [];

// load banned regex expressions
async function loadRegexPatterns(){
    try {
        const response = await fetch(chrome.runtime.getURL('banned.json'));
        const data = await response.json();
        bannedRegex = data.banWords.map(pattern => new RegExp(pattern));
        bannedChannels = data.banChannels;
        bannedIds = data.banIds;
        bannedTags = data.banTags;
    } catch (error) {
        console.error('Error fetching banned tokens: ', error);
    }
}

// remove elements by tag
function removeBannedTag(){
    bannedTags.forEach(tagName => {
        const elements = document.getElementsByTagName(tagName);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    });
}

// remove elements containing banned id
function removeBannedId() {
    bannedIds.forEach(id => {
        const element = document.getElementById(id);
        if(element){
            element.parentNode.removeChild(element);
        }
    });
}

// test if contain banned channel
function removeBannedChannel(element) {
    const hrefs = Array.from(element.getElementsByTagName('a'))
        .map(a => a.getAttribute('title') || '');

    let isBannedFound = false;
    return hrefs.some(href => {
        return bannedChannels.some(word => {
            if (href.includes(word)) {
                console.log(`Removed ${word}`);
                return true;
            }
            return false;
        });
    });
    return isBannedFound;
}

// remove elements containing banned title or channel
function removeBannedVideo() {
    const vidElems = document.getElementsByTagName("ytd-rich-item-renderer");
    const elemArray = Array.from(vidElems);

    elemArray.forEach(elem => {
        const targetElems = elem.querySelectorAll('#video-title');
        let removeThisElem = false;

        // test if banned regex in video title
        targetElems.forEach(targetElem => {
            bannedRegex.forEach(regex => {
                if (regex.test(targetElem.textContent)) {
                    removeThisElem = true;
                }
            });
        });

        if (removeBannedChannel(elem)) {
            removeThisElem = true;
        }

        if (removeThisElem) {
            elem.parentNode.removeChild(elem);
        }
    });
}

// Call the function periodically to handle dynamic content
loadRegexPatterns().then(() => {
    setInterval(() => {
        removeBannedTag(); // "Shorts", "Trending", "Shorts people also watched" sections
        removeBannedVideo(); // remove videos with title containing banned regex
        removeBannedId(); // remove element in banned id list
    }, 300); // 0.3 s
});

