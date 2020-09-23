// Global Variable
// Objects
function ScreenText() {
    this.container = document.createElement('div');
    this.container.id = 'screen-text',
    this.container.style.width = '600px';
    this.container.style.height = '200px';

    this.stage = new Konva.Stage({
        container: this.container,
        width: 600,
        height: 200,
        x: 600 /2,
        y: 200/2
    });

    this.layer = new Konva.Layer();

    this.screenText = new Konva.Text({
        text: 'Texthere',
        fontSize: 40,
        padding: 20
    });
}


ScreenText.prototype._init = function() {
    this.layer.add(this.screenText);
    this.stage.add(this.layer);
}

ScreenText.prototype._centerText = function() {
    this.screenText.offsetX(this.screenText.width()/2);
    this.screenText.offsetY(this.screenText.height()/2);
}

ScreenText.prototype._updateText = function(txt) {
    this.layer.add(this.screenText.setAttr('text', txt));
    this._centerText();
    this.stage.add(this.layer);
}

ScreenText.prototype._setFontSize = function(size) {
    this.layer.add(this.screenText.setAttr('fontSize', Number(size)));
    this._centerText();
    this.stage.add(this.layer);
}

ScreenText.prototype._setFontFamily = function(font) {
    this.layer.add(this.screenText.setAttr('fontFamily', font));
    this._centerText();
    this.stage.add(this.layer);
}

ScreenText.prototype._setFillColor = function(color) {
    this.layer.add(this.screenText.setAttr('fill', color));
    this.stage.add(this.layer);
}

ScreenText.prototype._getCanvas = function() {
    return this.container;
}

ScreenText.prototype._setStageWidth = function() {
    // console.log('first: ', this.stage.width());
    this.stage.width(this.screenText.width());
    this.stage.x(this.stage.width()/2)
    // console.log('After: ', this.stage.x(this.stage.width()/2));
    this.stage.draw();
}

ScreenText.prototype._export = function() {
    return this.stage;
}
// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    
    // Add to cart button before submit
    const addToCart = document.querySelector('.product-form__cart-submit');
    if(addToCart) {
        addToCart.addEventListener('click', function(e) {
            const numberText = document.getElementById('number-text');
            if(numberText) {
                getAllText(numberText.dataset.numberText);
            }
        })
    }
    // Get reference for Other service [VIP & Gift box]
    const chkGiftbox = document.getElementById('chk-giftbox');
    const chkVIP = document.getElementById('chk-vip-service');

    if(chkGiftbox) {
        chkGiftbox.addEventListener('click', function() {
            removeBuyBTN(chkGiftbox, chkVIP);
        })
    }

    if(chkVIP) {
        chkVIP.addEventListener('click', function() {
            removeBuyBTN(chkGiftbox, chkVIP); 
        })
    }

    // Get reference to option radio buttons parent element
    const radioOptionParent = document.getElementById('radio-options');
    // check if radio options exist
    if(radioOptionParent) {
        radioOptionParent.addEventListener('click', function(e) {
            if(e.target.type == 'radio' ) {
                // Get the option id
                const select = document.getElementById(e.target.parentElement.parentElement.dataset.optionId);
                // convert options into objects
                const options = Object.values(select.options);

                options.forEach(function(val) {
                    
                    if(val.text == e.target.value) {
                        val.selected = true;
                        select.dispatchEvent(new Event('change'));

                        // Display selected values
                        const optionLabel = e.target.parentElement.parentElement.children[0];
                        optionLabel.children[1].innerHTML = e.target.value;
                        return false; 
                    }
                })
            }
        })
    }

    // Get reference of the Names option selector
    const optionNames = document.getElementById(getNameOptionId());
    // Check if it has link to DOM Element
    if(optionNames) {
        const selectedOptionName = optionNames.value;
        addRemoveNames(selectedOptionName);

        optionNames.addEventListener('change', function () {

            const selectedOptionName = optionNames.value;

            addRemoveNames(selectedOptionName);
            
            // Get all the Input from DOM
            getAllInputFromDOM();

            // Set all the Font Color
            setAllFontColor();
        })
    }

    // Get all the Input from DOM
    getAllInputFromDOM();

    // Set all the Font Color
    setAllFontColor();

    // Get reference for text preview input [1 Name]
    const textPreviewInput = document.getElementById('text-preview-input');

    // Check if it has link to DOM Element
    if(textPreviewInput) {
        // Check if customer input text to text preview then call display function
        // Get the input first to remove spaces
        textPreviewInput.addEventListener('keyup', function() {
            // Remove text spaces if any from textPreviewInput Global Variable
            // const textPreview = removeSpaces(textPreviewInput.value);
    
            // Display it back to textPreviewInput
            // Make sure to capitalize first the first letter of word
            // textPreviewInput.value = capitalizeString(textPreview);
    
            // Display it to Text Preview
            printPreview(0, textPreviewInput.value, textPreviewInput.maxLength); 
        });
    }

    // Get reference of the Form Container to get refrence of what font the customer selected
    const textPreviewFontStyle = document.querySelector('.text-preview-fontstyle .product-form__container--grid');

    // Check if it has link to DOM Element
    if(textPreviewFontStyle) {
        // Get customer selected font style
        textPreviewFontStyle.addEventListener('click', function(e) {
            
            // First need to check if a valid option from font is selected
            if(e.target.classList.contains('product-form__container--grid')) {
                return false;
            } else {
                
                // If valid option is selected
                // Convert to Object
                const value = Object.values(e.target.dataset);
                // Get reference for text preview input [2 to 3 Name]
                ['1','2','3','4'].forEach(id => {
                    // Reference Text Font Style Preview
                    const textMulPreview = document.getElementById(`text-preview-${id}`);
                    // Check if it has link to DOM Element
                    if(textMulPreview) {
                        // Check if there is a class for fonts style then remove it
                        textMulPreview.className = textMulPreview.className.replace(/\bfont-family-*?\b/g, '');

                        // Assign class font style selected by customer
                        value.forEach(className => {
                            textMulPreview.classList.add(className);
                        });
                    }
                })

                // Reference Text Font Style Preview
                const textPreview = document.getElementById('text-preview');

                // Check if it has link to DOM Element
                if(textPreview) {
                    // Check if there is a class for fonts style then remove it
                    textPreview.className = textPreview.className.replace(/\bfont-family-*?\b/g, '');
        
                    // Assign class font style selected by customer
                    value.forEach(className => {textPreview.classList.add(className);});
                }
            }
        });
    }

    // Similar Products Modal
    const similarProductsLink = document.querySelector('.similar-products__link');
    // Check if modal is in HTML UI
    if(similarProductsLink) similarProductsLink.addEventListener('click', openCloseModal);

    // Get reference to close modal button from modal
    const closeModal = document.getElementById('close-modal');
    // Close the modal when click
    if(closeModal) closeModal.addEventListener('click', openCloseModal);

    // Remove Empty Element from Product Descriptions
    removeEmptyElements(); 
});

// Functions
// Get all the text from text inputs for text preview
function getAllText(txts) {

    // Initialize Screen Text
    const screenText = new ScreenText(); 
    screenText._init();

    screenText._setFontFamily($('#text-preview').length ? $('#text-preview').css('font-family') : $('#text-preview-1').css('font-family'));
    screenText._setFillColor(tinycolor($('#text-preview').length ? $('#text-preview').css('color') : $('#text-preview-1').css('color')).brighten(10).toString());
  
    switch(txts[0]) { 
        case '1' :
            screenText._setFontSize(55);
            screenText._updateText($('#text-preview').length ? $('#text-preview').html() : $('#text-preview-1').html());
            screenText._setStageWidth();
            document.getElementById('text-capture').value = screenText._export().toDataURL();
            break; 
        case '2' : 
            screenText._setFontSize(50); 
            screenText._updateText(`${$('#text-preview-1').html()} ${$('#text-preview-2').html()}`);
            screenText._setStageWidth();
            document.getElementById('text-capture').value = screenText._export().toDataURL(); 
            break;
        case '3' :
            screenText._setFontSize(40); 
            screenText._updateText(`${$('#text-preview-1').html()} ${$('#text-preview-2').html()} ${$('#text-preview-3').html()}`);
            screenText._setStageWidth();
            document.getElementById('text-capture').value = screenText._export().toDataURL();
            break;
        case '4' :
            screenText._setFontSize(37); 
            screenText._updateText(`${$('#text-preview-1').html()} ${$('#text-preview-2').html()} ${$('#text-preview-3').html()} ${$('#text-preview-4').html()}`);
            screenText._setStageWidth();
            document.getElementById('text-capture').value = screenText._export().toDataURL();
            break;
    }
}
// Remove buy button
function removeBuyBTN(chkGiftbox, chkVIP) {
    try {

        if(chkGiftbox.checked || chkVIP.checked) {
            document.querySelector('.shopify-payment-button').style.display = 'none';
        } else {
            document.querySelector('.shopify-payment-button').style.display = 'block';
        }

    } catch(e) {
        // This is if one of the add on offer is available
        if(chkGiftbox) {
            if(chkGiftbox.checked) {
                document.querySelector('.shopify-payment-button').style.display = 'none';
            }else {
                document.querySelector('.shopify-payment-button').style.display = 'block';
            }
        }

        if(chkVIP) {
            if(chkVIP.checked) {
                document.querySelector('.shopify-payment-button').style.display = 'none';
            }else {
                document.querySelector('.shopify-payment-button').style.display = 'block';
            }
        }
    }
}

function openCloseModal(e) {
    // Prevent link default 
    e.preventDefault();

    // get reference from html DOM UI
    const similarProductsModal = document.querySelector('.similar-products--modal');
    // Add remove the show modal class
    if(similarProductsModal) similarProductsModal.classList.toggle('show-modal');
}

// Get all the custom input from DOM
function getAllInputFromDOM() {
    
    // Get reference for text preview input [2 to 3 Name]
    ['1','2','3','4'].forEach(id => {
        const textMulPreviewInput = document.getElementById(`text-preview-input-${id}`);
        // Check if it has link to DOM Element
        if(textMulPreviewInput) {
            textMulPreviewInput.addEventListener('keyup', function() {
                // Remove text spaces if any from textPreviewInput Global Variable
                // const textMulPreview = removeSpaces(textMulPreviewInput.value);

                // Display it back to textPreviewInput
                // Make sure to capitalize first the first letter of word
                // textMulPreviewInput.value = capitalizeString(textMulPreview);
        
                 // Display it to Text Preview
                printPreview(id, textMulPreviewInput.value, textMulPreviewInput.maxLength);
            })
        }
    })
}


// Get Color option ID
function getColorOptionId() {
    
    const shopifyOption = document.querySelector('.custom-form__controls-group');
    
    let optionID;
    if(shopifyOption) {
        const objectForm = Object.values(shopifyOption.children);
        
        objectForm.forEach(tags => { 
            let tag = Object.values(tags.children);
            tag.forEach(t => {
                if(t.dataset.optionName == 'Color' || t.dataset.optionName == 'Metal Color' || t.dataset.optionName == 'Main Stone Color') {
                    optionID = t.nextElementSibling.id;
                    return false;
                } 
            })
        })
    }
    return optionID;
}

// Set the font color of option color
function setAllFontColor() {
    // get reference of the Font Option Color
    const optionColor = document.getElementById(getColorOptionId());

    
    // Check if it has link to DOM Element
    if(optionColor) {
        const selectedOptionColor = optionColor.value;
        
        setFontColor(selectedOptionColor);

        // Fire when color option is change
        optionColor.addEventListener('change', function(e) {
            setFontColor(e.target.value);
        })
    }
}

// Get Names option ID
function getNameOptionId() {
    
    const shopifyOption = document.querySelector('.custom-form__controls-group');

    let optionID;

    if(shopifyOption) {
        const objectForm = Object.values(shopifyOption.children);

        objectForm.forEach(tags => {
            let tag = Object.values(tags.children);
            tag.forEach(t => {
                if(t.dataset.optionName == 'Name' || t.dataset.optionName == 'Names') {
                    optionID = t.nextElementSibling.id;
                }
            })
        })
    }

    return optionID;
}

// Print text while customer is inputing text
function printPreview(id, text, maxLength) {

    // 2 Name
    // Get reference of text preview [2 Name]
    const textMulPreview = document.getElementById(`text-preview-${id}`);
    // Check if it has link to DOM Element
    if(textMulPreview) {
        // Display it to text preview
        textMulPreview.innerText = text;

        const textMulPreviewLabel = document.querySelector(`#input-preview-label-${id} span`);
        if(textMulPreviewLabel) {
            // Update numbers of char left
            textMulPreviewLabel.textContent = maxLength - Number(text.length);
        }
    }

    // 1 Name
    // Get reference of text preview [1 Name]
    const textPreview = document.getElementById('text-preview');

    // Check if it has link to DOM Element
    // Display it to text preview
    if(textPreview) textPreview.innerText = text;

    // Update number of characters left
    // Get reference to text preview label
    const textPreviewLabel = document.querySelector('#input-preview-label span');

    // Check if it has link to DOM Element
    // Update numbers of char left
    if(textPreviewLabel) textPreviewLabel.textContent = maxLength - Number(text.length);
}

// Remove spaces of strings
const removeSpaces = (string) => {return string.split(' ').join('');}

// Capitalize the string
const capitalizeString = (string) => {
    if(typeof string != 'string') return '';
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add names to the UI
const addRemoveNames = (howManyName) => {
    // Set the data value for how many name option for text preview
    document.getElementById('number-text').dataset.numberText = howManyName; 
    const containerInnerInput = document.getElementById('product-form__input');
    
    // Input Max variables
    let howChar; 
    let input2Max = 13, 
        input3Max = 13, 
        input4Max = 13;

    // Get input max from HTML Data
    if(containerInnerInput) {
        howChar = containerInnerInput.dataset.tagMax.split(',');
        input2Max = howChar[0];
        input3Max = howChar[1];
        input4Max = howChar[2]; 
    }


    if(howManyName[0] == '1'){
        ['2','3','4'].forEach(id => {
            const element_label = document.querySelector(`.form-label-${id}`);
            const element_input = document.querySelector(`.form-input-${id}`);
            if(element_label && element_input) {
                element_label.remove();
                element_input.remove();
            }
        })
    } else if(howManyName[0] == '2') {
        const element_label_2 = document.getElementById(`text-preview-2`);
        const element_input_2 = document.getElementById(`container--input-2`);
        
        if(!element_label_2 && !element_input_2) { 
            
            addInputLabel(2, input2Max);
        }
        ['3','4'].forEach(id => {
            const element_label_2 = document.querySelector(`.form-label-${id}`);
            const element_input_2 = document.querySelector(`.form-input-${id}`);
            if(element_label_2 && element_input_2) {
                element_label_2.remove();
                element_input_2.remove();
            }
        })
    } else if(howManyName[0] == '3') {

        ['2','3'].forEach(id => {
            const element_label = document.getElementById(`text-preview-${id}`);
            const element_input = document.getElementById(`container--input-${id}`);
            if(!element_label && !element_input) {

                // Input Max
                let inputMax = id == '2' ? input2Max : input3Max;

                addInputLabel(id, inputMax);
            } 
            
        })

        const element_label_3 = document.querySelector(`.form-label-4`);
        const element_input_3 = document.querySelector(`.form-input-4`);
        if(element_label_3 && element_input_3) {
            element_label_3.remove();
            element_input_3.remove();
        }
    } else if(howManyName[0] == '4') { 
        ['2','3','4'].forEach(id => {
            const element_label = document.getElementById(`text-preview-${id}`);
            const element_input = document.getElementById(`container--input-${id}`);

            // Input Max
            if(!element_label && !element_input) {
                let inputMax;
                switch(id) {
                    case '2':
                        inputMax = input2Max;
                        break;
                    case '3':
                        inputMax = input3Max;
                        break;
                    case '4':
                        inputMax = input4Max;
                }

                addInputLabel(id, inputMax);
            }
        })
    }
}
// Set Font Color
const setFontColor = (selectedColor) => {
    const fontColor = {
        gold: 'font-color-gold',
        roseGold: 'font-color-rose-gold',
        silver: 'font-color-silver'
    }
    const fontColorHover = {
        gold: 'font-color-hover-gold',
        roseGold: 'font-color-hover-rose-gold',
        silver: 'font-color-hover-silver'
    }
    const fontColorSelected = {
        gold: 'font-color-selected-gold',
        roseGold: 'font-color-selected-rose-gold',
        silver: 'font-color-selected-silver'
    }

    if(selectedColor == 'Gold' || selectedColor == 'gold') {
        updateFontColor(fontColor.gold, fontColorHover.gold, fontColorSelected.gold);
    } else if(selectedColor == 'Rose Gold' || selectedColor == 'Rose gold' || selectedColor == 'rose gold') {
        updateFontColor(fontColor.roseGold, fontColorHover.roseGold, fontColorSelected.roseGold);
    } else if (selectedColor == 'Silver' || selectedColor == 'silver') {
        updateFontColor(fontColor.silver, fontColorHover.silver, fontColorSelected.silver);
    }
}

// Update FontColor
function updateFontColor(colorClassName, hover, selected) {

    // Reference text preview [2 Name to 3 Name]
    ['1','2','3','4'].forEach(id => {
        const textMulPreview = document.getElementById(`text-preview-${id}`);
        // Check if it has link to DOM Element
        if(textMulPreview) {
            // Remove text preview class for color
            textMulPreview.className = textMulPreview.className.replace(/\bfont-color-.*?\b/g, '');

            // Add selected text preview color
            textMulPreview.classList.add(colorClassName);
        }
    })


    // Reference text preview [1 Name]
    const textPreview = document.getElementById('text-preview');
    const fontOptions = Object.values(document.getElementsByClassName('product-form__font-style'));
    // Check if it has link to DOM Element
    if(textPreview) {
        // Remove text preview class for color
        textPreview.className = textPreview.className.replace(/\bfont-color-.*?\b/g, '');

        // Add selected text preview color
        textPreview.classList.add(colorClassName);
    }

    if(fontOptions) {
        // Selected & Hover
        fontOptions.forEach(fontOption => {
            fontOption.className = fontOption.className.replace(/\bfont-color-selected-*?\b/g, '');
            fontOption.className = fontOption.className.replace(/\bfont-color-hover-*?\b/g, '');

            // Add Selected & Hover color based on customer choosen color
            fontOption.classList.add(hover, selected);
        });
    }
    
}

// Remove empty element of products description
function removeEmptyElements() {
    // Get Reference 
    const panel = document.querySelectorAll('.product-details__panel');
    // check if panel exist in the DOM
    if(panel) {
        panel.forEach(p => {
            const elem = Object.values(p.children);
            elem.forEach(elm => {
                if(elm.innerHTML == '' || elm.value == '') {
                    elm.remove(); 
                }
            })
            
        })
    }
}

// Check for checkbox click event
function chkOneOnly(chk) {
    const checkbox = document.getElementsByName('checkbox');
    checkbox.forEach(item => {
        if(item !== chk) item.checked = false;
    })
}

// HTML Template for Text preview & Text Input
function addInputLabel(id, inputMax) {
    const containerInnerLabel = document.getElementById('container-inner-label');
    const textPreviewContainer = document.querySelector('.text-preview-container');
    
    const productForm = document.createElement('div');
    productForm.className = `product-form r-p-all form-label-${id}`;
    productForm.innerHTML += `
    <div class="product-form__container display-flex"> 
        <label class="product-form__container--label s-m-right" for="text-preview-input-${id}">Preview:</label>
        <div id="container-inner-label" class="product-form__container--inner display-grid grid-col-1">
            <label class="product-form__container--text font-family-${containerInnerLabel.dataset.fontFamily} font-size-l font-color-gold" type="text" 
            name="text-preview" id="text-preview-${id}"></label>
        </div>
    </div> 
    `

    const productFormInput = document.createElement('div');
    productFormInput.className = `form-input-${id} product-form r-p-all display-grid grid-col-1`;
    productFormInput.innerHTML = `
    <div id="container--input-${id}" class="product-form__container--input">
        <input class="product-form__container--input-text product-form__input s-m-top " type="text" name="properties[Custom Text ${id}]"
        id="text-preview-input-${id}" placeholder="Enter name ${id}" maxlength="${inputMax}" minlength="2" required="required">
        <label class="product-form__container--input-label" for="text-preview-input-${id}" id="input-preview-label-${id}"><span>${inputMax}</span> Left</label>
    </div> 
    `
    textPreviewContainer.appendChild(productFormInput);
    textPreviewContainer.appendChild(productForm);
}