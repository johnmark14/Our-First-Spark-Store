// Global Variables

// Objects
// Modal Object
function EngraveModal() {
    this.engraveModal = document.querySelector('.modal-container__engrave');
}

// Open Modal
EngraveModal.prototype._openModal = function() {
    if(this.engraveModal) {
        document.body.style.overflow = 'hidden';
        this.engraveModal.classList.add('show-modal');
    }
}

// Close Modal
EngraveModal.prototype._closeModal = function() {
    if(this.engraveModal) {
        document.body.style.overflow = 'auto';
        this.engraveModal.classList.remove('show-modal');
    }
}

// Loader Object
function EngraveLoader() {
    this.engraveLoader = document.getElementById('loader-engrave-container');
    this.engraveCloseBTN = document.getElementById('close-engrave-modal');
}

// Show Loader
EngraveLoader.prototype._showLoader = function() {
    this.engraveLoader.classList.add('show-modal');
    this.engraveLoader.style.cursor = 'progress';
    this.engraveCloseBTN.style.display = 'none';
}

// Hide Loader
EngraveLoader.prototype._hideLoader = function() {
    this.engraveLoader.classList.remove('show-modal');
    this.engraveLoader.style.cursor = 'normal';
    this.engraveCloseBTN.style.display = 'block';
}

// Canvas Object
function EngraveCanvas() {
    this.Frame = {
        Draw: function(frameURL) {
            const image = new Image();
            image.onload =()=> {
                const context = document.getElementById('frame-engrave-canvas').getContext('2d');
                context.drawImage(image, 0,0);
            }
            image.src = frameURL;
        }
    }
}

// Draw the Engrave Frame 
EngraveCanvas.prototype._drawFrame = function(framURL) {
    this.Frame.Draw(framURL);
}

// Engrave Text Object
function EngraveText() {

    this.stage = new Konva.Stage({
        container: 'engraving-canvas'
    });

    this.layer = new Konva.Layer();

    this.engraveText = new Konva.Text({
        text: 'Text here',
        fontFamily: 'Normal',
        fontSize: 20,
        fill: '#A39074',
        shadowColor: '#fff',
        shadowOffsetX: 0,
        shadowOffsetY: 1,
        shadowOpacity: .9,
        shadowBlur: 0,
        draggable: true
    });
}

// Center Canvas Text Initialize
EngraveText.prototype._init = function() {

    this.engraveText.on('mouseenter', ()=> {
        this.stage.container().style.cursor = 'move';
    });

    this.engraveText.on('mouseleave', ()=> {
        this.stage.container().style.cursor = 'default';
    });

    this.layer.add(this.engraveText);
    this.stage.add(this.layer);
}
// Center Canvas Text CenterText
EngraveText.prototype._centerText = function() {
    this.engraveText.offsetX(this.engraveText.width() / 2);
    this.engraveText.offsetY(this.engraveText.height() /2);
}
// update canvas size
EngraveText.prototype._setStageSize = function(width, height) {
    this.stage.setAttr('width', width);
    this.stage.setAttr('height', height);

    this.layer.add(this.engraveText.setAttr('x', width / 2));
    this.layer.add(this.engraveText.setAttr('y', height / 2));
    this._centerText();
    this.stage.add(this.layer);
}
// Update Canvas Text
EngraveText.prototype._updateText = function(txt) {
    this.layer.add(this.engraveText.setAttr('text', txt));
    this._centerText();
    this.stage.add(this.layer);
}
// Update Canvas Text Font Size
EngraveText.prototype._updateFontSize = function(size) {
    this.layer.add(this.engraveText.setAttr('fontSize', Number(size)));
    this._centerText();
    this.stage.add(this.layer);
}
// Update font family
EngraveText.prototype._updateFontFamily = function(font) {
    this.layer.add(this.engraveText.setAttr('fontFamily', font));
    this._centerText();
    this.stage.add(this.layer);
}
// Set Fill Color
EngraveText.prototype._setFillColor = function(color) {
    this.layer.add(this.engraveText.setAttr('fill', color));
    this.stage.add(this.layer);
}
// Get font family use
EngraveText.prototype._getFontFamily = function() {
    return this.engraveText.attrs.fontFamily;
}

EngraveText.prototype._getText = function() {
    return this.stage;
}


// This get Frame and Text from canvas to image and redraw theme
function RedDrawTexts(photo, frame, x, y) {
    this.photo = photo;
    this.frame = frame;
    this.left = x;
    this.top = y;

    const board = document.createElement('div');
    board.style.width = '320px';
    board.style.height = '320px';
    board.style.border = '1px solid red';
    board.style.overflow = 'hidden';

    this.stage = new Konva.Stage({
        container: board,
        width: 320,
        height: 320
    });

    const layer = new Konva.Layer();
    this.stage.add(layer);

    const textFrame = new Image();
    textFrame.onload =()=> {
        const img = new Konva.Image({
            x: 0,
            image: textFrame
        });

        layer.add(img);
        layer.batchDraw();

        // The Text
        const engraveText = new Image();
        engraveText.onload =()=> {
            const img = new Konva.Image({
                x: this.left,
                y: this.top,
                image: engraveText 
            });

            layer.add(img);
            layer.batchDraw(); 
        }

        engraveText.src = this.photo;
    }

    textFrame.src = this.frame; 
}

// Get the stage to get the image src
RedDrawTexts.prototype._getTexts = function() {
    return this.stage;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Modal Object
    const engraveModal = new EngraveModal();
    // Initialize Canvas Object
    const engraveCanvas = new EngraveCanvas();
    // Initialize Canvas Text Object
    const engraveText = new EngraveText();
    // Initialize Canvas Text Object Prope
    engraveText._init();
    // Initialize Modal Loader
    const engraveLoader = new EngraveLoader();

    // Get reference to add Engraving Button on the product page
    const engravingContainer = document.querySelector('.engraving-container');

    // Check if addengraving is available
    if(engravingContainer) {
        engravingContainer.addEventListener('click', function(e) {
          if(e.target.parentElement.classList.contains('big') || e.target.classList.contains('big')) {
            //   OPen preview modal
            // Remove the focus to the current element
            this.blur();

            // Set the state of the modal
            previewState = true;

            // Preview the picture
            openModalPicture('engrave-text');
          } else {
              engraveModal._openModal();
          }
        })
    }

    const closeEngraving = document.getElementById('close-engrave-modal');
    if(closeEngraving) {
        closeEngraving.addEventListener('click', function() {
            // Close Text Engraving Modal
            engraveModal._closeModal();
        })
    }

    // Const get reference to Canvas Textarea
    const engraveTextArea = document.getElementById('engrave-textarea');
    if(engraveTextArea) {
        engraveTextArea.addEventListener('keyup', function() {
            engraveText._updateText(engraveTextArea.value);
        })
    }

    // Get reference to font size select option
    const fontSize = document.getElementById('font-size');
    if(fontSize) {
        engraveText._updateFontSize(fontSize.value);
        fontSize.addEventListener('change', function() {
            engraveText._updateFontSize(fontSize.value);
        })
    }

    // Get reference to Font Styles Options
    const fontStyle = document.querySelector('.engrave-preview-fontstyle .product-form__container--grid ');
    if(fontStyle) {
        fontStyle.addEventListener('click', function(e) {
            if(e.target.classList.contains('product-form__container--grid')) {
                return false;
            }

            // Update fontfamily base from data attributes of valid options
            const { fontFamily } = e.target.dataset;
            engraveText._updateFontFamily(fontFamily);
        })
    }

    // Confirm Engraving 
    const confirmEngraving = document.getElementById('confirm-engraving'); 
    if(confirmEngraving) {
        confirmEngraving.addEventListener('click', function() {
            if(getTextArea()) {
                engraveLoader._showLoader();
                document.querySelector('.modal-container__engrave-inner').scrollTop = 0;

                // Draw the frame for Necklace
                const engraveFrame = Canvas2Image.convertToImage(document.getElementById('frame-engrave-canvas'), 320, 320).src;
                const engravePhoto = document.querySelector('#engraving-canvas .konvajs-content canvas');
                // const engravePhotoSRC = Canvas2Image.convertToImage(engravePhoto, engravePhoto.width, engravePhoto.height).src;
                let engravePhotoSRC = engraveText._getText().toDataURL();
            
                // Get Parent & Child Coordinates
                const engraveParent = document.querySelector('.engraving-preview').getBoundingClientRect();
                const engraveChild = document.querySelector('#engraving-canvas').getBoundingClientRect();
                
                // Get the Coordinates
                const relativePos = {
                    top: engraveChild.top - engraveParent.top,
                    left: engraveChild.left - engraveParent.left
                };

                // Initialize RedrawText and pass arguments
                const draw = new RedDrawTexts(engravePhotoSRC, engraveFrame, relativePos.left, relativePos.top);
                setTimeout(() => { 
                    setEngravingPhoto(draw._getTexts().toDataURL());
                    setEngravingText(document.getElementById('engrave-textarea').value);
                    updateEngravingButton(true, 'Change');
                    setEngravingFontStyle(engraveText._getFontFamily().toString());
                    engraveLoader._hideLoader(); 
                    engraveModal._closeModal();
                }, 2500);
            }else {
                alert("Please Enter a Text to Engrave!");
                document.getElementById('engrave-textarea').focus();
            }
        });
    }

    // No Engraving
    const noEngraving = document.getElementById('no-engraving');
    if(noEngraving) {
        noEngraving.addEventListener('click', function() {
            setEngravingText('');
            setEngravingFontStyle('');
            setEngravingPhoto('');
            updateEngravingButton(false, 'Add');
            engraveModal._closeModal();
        })
    }

    // Draw the frame for Necklace
    const engraveFrame = document.getElementById('engrave-frame');
    if(engraveFrame) {
        const {frame, color, height, width} = JSON.parse(engraveFrame.dataset.engraveTextConfig);

        toDataURL(frame, function(frameURL) {
            // Draw the fram
            engraveCanvas._drawFrame(frameURL);
        });

        // Set text color depends on what frame material is.
        engraveText._setFillColor(color);

        // Set the engrave canvas size
        engraveText._setStageSize(width, height);
    }
})

// Functions

// Set Engraving Text & Attach to form
function setEngravingText(txt) {
    const engravingText = document.getElementById('engraving-text');
   
    if(txt != '') {
        engravingText.value = txt;
        engravingText.checked = true;
    } else {
        engravingText.value = 'No Engravings';
        engravingText.checked = true;
    }
}

// Set Engraving Font Style 
function setEngravingFontStyle(font) {
    const engravingFont = document.getElementById('engraving-font');
    if(font != '') {
        engravingFont.value = font;
        engravingFont.name = 'properties[Font Style]';
    } else {
        engravingFont.value = 'None';
        engravingFont.name = '';
    }
}

// Set Engraving Photo & attach to form
function setEngravingPhoto(photo) {
    const engravingPhoto = document.getElementById('engraving-photo');
    const previewEngravingText = document.querySelector('#preview-engraving-text');

    if(photo != '') {
        engravingPhoto.value = photo;
        engravingPhoto.checked = true;
        engravingPhoto.name = 'properties[_Engraving Photo]';
        previewEngravingText.style.display = 'flex';
        previewEngravingText.children[0].src = photo; 
    }else{
        engravingPhoto.value = 'None';
        engravingPhoto.checked = true;
        engravingPhoto.name = '';
        previewEngravingText.style.display = 'none';
        previewEngravingText.children[0].src = null;
    }
}

// update Engraving Buttons
function updateEngravingButton(chk, btnText) {
    if(chk) {
        document.querySelector('.preview-lettering span').style.display = 'none';
    } else {
        document.querySelector('.preview-lettering span').style.display = 'block';
        document.querySelector('.preview-lettering span').innerHTML = 'No Engravings';
    }
    document.getElementById('add-engraving').innerHTML = btnText;
} 

// Check if text area is not empty
function getTextArea() {
    if(document.getElementById('engrave-textarea').value != '') {
        return true;
    } else {
        return false;
    }
}


