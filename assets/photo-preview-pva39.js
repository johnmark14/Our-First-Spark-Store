// Global Variables
var previewState = false;
var frameURL;
var drawImage; 
// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Create new instance of DrawingModal
    drawImage = new DrawImage();

    const fabricCanvas = document.querySelector('.canvas-fabric-container');
    // Zoom in and Zoon out using touch gesture
    const pinchTouch = new Hammer(fabricCanvas);
    pinchTouch.get('pinch').set({enable: true});
    
    pinchTouch.on('pinchin', function() {
        drawImage._action('pinch-small');
    });
    pinchTouch.on('pinchout', function() {
        drawImage._action('pinch-big');
    });
    // Zoom in and Zoon out using scroll wheel
    const scrollContainer = document.getElementById('scroll-overflow'); 
    if(fabricCanvas) {
        fabricCanvas.addEventListener('mouseover', function() {
            disableScroll(scrollContainer);
        });
        fabricCanvas.addEventListener('mousewheel', function(e) {
            if (e.deltaY == -100) { 
                drawImage._action("zoom-big"); 
            }else {
                drawImage._action("zoom-small");
            }
        });
        fabricCanvas.addEventListener('mouseout', function() {
            enableScroll();
        });
    }

    // Get reference to canvas control customize buttons functions
    const canvasControl = document.querySelector('.photo-buttons');
    if(canvasControl) {
        canvasControl.addEventListener('click', function(e) {
            drawImage._action(e.target.dataset.method);
        });
    }

    // Get reference to Cart Image Container
    const cartImageWrapper = document.querySelector('.line-items-container');
    if(cartImageWrapper) {
        cartImageWrapper.addEventListener('click', function(e) {
            if(e.target.parentElement.classList.contains('cart-onclick')) {
                
                // Remove the focus to the current element
                this.blur(); 
    
                // Set the state of the modal
                previewState = true;
                 
                // Preview the picture
                openModalCartPicture(Object.values(e.target.parentElement.children)[0]);
            }
        })
    }

    // Get reference to photo file input after edit
    const photoFileChange = document.querySelector('.after-preview #photo-file-2');

    // Check if photo file is available
    if(photoFileChange) {
        photoFileChange.addEventListener('change', function() {
            // Remove the focus
            this.blur();
            // Set the state of the modal
            previewState = false;

            if(photoFileChange.files) {
                const fr = new FileReader();
                fr.onload =()=> {
                    // Draw the frame
                    drawImage._setFrame(frameURL);
                    openModalChange(fr.result);
                }
                fr.readAsDataURL(photoFileChange.files[0]);
            }
        })
    }

    // Get reference to photo file input
    const photoFile = document.getElementById('photo-file');
    if(photoFile) {
        photoFile.addEventListener('change', function() {
            // Remove the focus
            this.blur();
            // Set the state of the modal
            previewState = false;

            if(photoFile.files) {
                const fr = new FileReader();
                fr.onload = () => {

                    // Draw the frame
                    drawImage._setFrame(frameURL);
                    openModal(fr.result);
                }
                fr.readAsDataURL(photoFile.files[0]);
            }
        })
    }

    // Close the modal button click event
    const modal = document.getElementById('close-preview-modal');
    if(modal) {
        modal.addEventListener('click', function() {
            if(!previewState) {
                if(showMessage('close')) {
                    // Remove the focus
                    this.blur();

                    const confirmChangePicture = document.getElementById('confirm-change-picture');
                    if(confirmChangePicture.style.display == 'block') {
                        closeModal('reset-change');
                    } else {
                        closeModal('reset');
                    }
                }
            } else {
                // Remove the focus
                this.blur();

                showHideLoader('hide-picture');
                closeModal('no');
            }
        }); 
    }

    // Change customer picture event on image preview modal
    const changePicture = document.getElementById('change-picture');
    if(changePicture) {
        changePicture.addEventListener('click', function() {
            if(showMessage('close')) {
                // Remove the focus
                this.blur();

                const confirmChangePicture = document.getElementById('confirm-change-picture');
                if(confirmChangePicture.style.display == 'block') {
                    closeModal('reset-change');
                    const photoFile = document.querySelector('.after-preview #photo-file-2');
                    if(photoFile) {
                        photoFile.click();
                    }
                } else {
                    closeModal('reset');
                    const photoFile = document.getElementById('photo-file');
                    if(photoFile) {
                        photoFile.click();
                    }
                }
            } else {
                return;
            }
        })
    }

    // Confirm Picture of the customer
    // get reference of confirm picture from DOM
    const confirmPicture = document.getElementById('confirm-picture');
    if(confirmPicture) {
        confirmPicture.addEventListener('click', function() {
            if(showMessage('confirm')) {
                // Remove the focus
                this.blur();

                showHideLoader('show');

                // Convert each canvas to picture
                const picture = Canvas2Image.convertToImage(document.getElementById('photo-canvas'), 320, 320).src;
                // Set this as an image 
                const draw = new ReDrawImages(picture);

                const uploadPhoto1 = document.getElementById('upload-photo-1');
                uploadPhoto1.style.display = 'none';
                const uploadPhoto2 = document.getElementById('upload-photo-2');
                uploadPhoto2.style.display = 'flex';
                // Set Delay
                setTimeout(() => {
                    const previewCrop = document.getElementById('preview-crop');
                    previewCrop.src = draw.getImages().toDataURL();
                    const editedPhoto = document.getElementById('edited-photo');
                    editedPhoto.value = draw.getImages().toDataURL();
                    showHideLoader('hide'); 
                    closeModal('no');
                }, 2500);
            } else {
                return;
            }
        });
    }

    // Confirm to change or Update the picture
    const confirmChangePicture = document.getElementById('confirm-change-picture');
    if(confirmChangePicture) {
        confirmChangePicture.addEventListener('click', function() {
            if(showMessage('confirm-change')) {
                // Remove the focus
                this.blur();

                showHideLoader('show');

                // Replace old input file
                const photoFile = document.querySelector('.upload-photo__inner #photo-file');
                // Create an Object to store photoFile Attributes
                const photoFileAttrib = {
                    id: photoFile.id,
                    name: photoFile.name
                }
                // Remove photoFile element from DOM to replace with new
                photoFile.remove();
                // Deconstruct the Object
                let {name, id} = photoFileAttrib;

                // Create a copy of input file
                const copy = document.querySelector('.after-preview #photo-file-2').cloneNode();
                copy.name = name;
                copy.id = id;
                copy.setAttributeNode(document.createAttribute("required"));

                // Insert the copy to the DOM
                document.querySelector('.upload-photo__inner').insertBefore(copy, document.querySelector('.upload-photo__inner span'));
                
                // Convert each canvas to picture
                const picture = Canvas2Image.convertToImage(document.getElementById('photo-canvas'), 320, 320).src;
                // Set this as an image 
                const draw = new ReDrawImages(picture);
                
                // Set a delay
                setTimeout(() => {
                    const previewCrop = document.getElementById('preview-crop');
                    const editedPhoto = document.getElementById('edited-photo');

                    editedPhoto.value = draw.getImages().toDataURL();
                    previewCrop.src = draw.getImages().toDataURL();

                    showHideLoader('hide');
                    closeModal('no');
                }, 2500);
            }
        })
    }

    // Event to preview the picture
    const previewPicture = document.querySelector('.upload-photo .big');
    if(previewPicture) {
        previewPicture.addEventListener('click', function() {
            // Remove the focus to the current element
            this.blur();

            // Set the state of the modal
            previewState = true;

            // Preview the picture
            openModalPicture('photo');
        })
    }

    // Get the frame CDN
    const photoFrame = document.getElementById('photo-frame');
    // Check if photoFrame exist
    if(photoFrame) {
        toDataURL(photoFrame.dataset.photoFrame, function(dataUrl) {
            // Draw the frame
            frameURL = dataUrl;
        });
    } else {
        toDataURL('', function(dataUrl) {
            // Draw the frame
            // drawFrame(dataUrl);
            frameURL = dataUrl; 
        });

    }
})

// Functions
// Stops scroll wheel from working
function disableScroll(scrollContainer) {
    // Get the current page scroll position 
    scrollTop =  
    scrollContainer.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft =  
    scrollContainer.pageXOffset || document.documentElement.scrollLeft, 

        // if any scroll is attempted, 
        // set this to the previous value 
        scrollContainer.onscroll = function() {
            scrollContainer.scrollTo(scrollTop, scrollLeft); 
        }; 
} 
// Enable the scroll wheel
function enableScroll() { 
    const scrollContainer = document.getElementById('scroll-overflow');
    scrollContainer.onscroll = function() {}; 
}

// Convert CDN to base64 image
function toDataURL(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        let reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result); 
        }

        reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

// Show or Hide the loader
function showHideLoader(type) {
    const loaderContainer = document.getElementById('loader-container');
    const previewPicture = document.getElementById('preview-picture');
    const closeModal = document.getElementById('close-preview-modal');
    if(loaderContainer) {
        switch(type) {
            case 'hide':
                loaderContainer.classList.remove('show-modal');
                loaderContainer.style.cursor = 'normal';
                closeModal.style.display = 'block';
                break;
            case 'show':
                loaderContainer.classList.add('show-modal');
                loaderContainer.style.cursor = 'progress';
                closeModal.style.display = 'none';
                break;
            case 'hide-picture':
                previewPicture.classList.remove('show-modal');
        }
    }
}

// Show alert message for closing
function showMessage(type) {
    let result;
    switch(type) {
        case 'close':
            result = confirm("Are you sure you want to discard your changes?");
            break;
        case 'confirm':
            result = confirm("This will confirm your changes!");
            break;
        case 'confirm-change':
            result = confirm("This will replace your previous picture!");
            break;
    }

    return result;
}

// Close the image preview Modal
function closeModal(type) {
    drawImage._dispose();
    drawImage._setCanvas();

    document.body.style.overflow = 'auto';

    const modalContainer = document.querySelector('.modal-container');
    const modalSccrollView = document.querySelector('.scroll-overflow');
    if(modalContainer) modalContainer.classList.remove('show-modal');
    if(modalSccrollView) modalSccrollView.style.visibility = 'hidden';

    if(type === 'reset') {
        const photoFile = document.getElementById('photo-file');
        if(photoFile) photoFile.value = null;
    } else if(type === 'reset-change') {
        const photoFileChange = document.querySelector('.after-preview #photo-file-2');
        if(photoFileChange) photoFileChange.value = null;
    }
}

// Open the Modal & add the photo
function openModal(photo) {
    document.body.style.overflow = 'hidden';

    const modalContainer = document.querySelector('.modal-container');
    const modalSccrollView = document.querySelector('.scroll-overflow');
    if(modalContainer) modalContainer.classList.add('show-modal');
    if(modalSccrollView) modalSccrollView.style.visibility = 'visible';

    drawImage._setImage(photo);
}

// Open the modal for Image preview
function openModalPicture(image) {
    document.body.style.overflow = 'hidden';

    // Get reference to the modal container
    const modalContainer = document.querySelector('.modal-container');
    if(modalContainer) modalContainer.classList.add('show-modal');

    // Get reference to the preview picture
    const previewPicture = document.getElementById('preview-picture');
    if(previewPicture) previewPicture.classList.add('show-modal');

    // Copy the picture from crop picture to the preview picture
    const myPreviewPicture = document.querySelector('#preview-picture #picture1');
    if(image == 'photo') {
        myPreviewPicture.src = document.getElementById('preview-crop').src;
    } else {
        myPreviewPicture.src = document.getElementById('engrave-preview-crop').src;
    }

}
// Open the modal for Image preview
function openModalCartPicture(image) {
    document.body.style.overflow = 'hidden';

    // Get reference to the modal container
    const modalContainer = document.querySelector('.modal-container');
    if(modalContainer) modalContainer.classList.add('show-modal');

    // Get reference to the preview picture
    const previewPicture = document.getElementById('preview-picture');
    if(previewPicture) previewPicture.classList.add('show-modal');

    // Copy the picture from crop picture to the preview picture
    document.querySelector('#preview-picture #picture1').src = image.src; 
    
    const pic1 = image.src.substr(image.src.length -25);

    const pic2 = image.dataset.engravingPhoto.substr(image.dataset.engravingPhoto.length -25);

    if( pic1 != pic2) {
        document.querySelector('#preview-picture #picture2').src = image.dataset.engravingPhoto;
    } else {
        document.querySelector('#preview-picture #picture2').src = '';
    }
}

// For changing or updating photo 
function openModalChange(photo) {
    document.body.style.overflow = 'hidden';

    const modalContainer = document.querySelector('.modal-container');
    const modalSccrollView = document.querySelector('.scroll-overflow');
    if(modalContainer) modalContainer.classList.add('show-modal');
    if(modalSccrollView) modalSccrollView.style.visibility = 'visible';

    const confirmPicture = document.getElementById('confirm-picture');
    if(confirmPicture) confirmPicture.style.display = 'none';

    const confirmChangePicture = document.getElementById('confirm-change-picture');
    if(confirmChangePicture) confirmChangePicture.style.display = 'block';

    drawImage._setImage(photo);
}

// This get the from canvasToImage and redraw them
function ReDrawImages(photo, frame) {
    this.photo = photo;

    const board = document.createElement('div');
    board.id = 'canvas-container';
    board.style.width = '320px';
    board.style.height = '320px';
    board.style.overflow = 'hidden';

    this.stage = new Konva.Stage({
        container: board,
        width: 320,
        height: 320
    });

    const layer = new Konva.Layer();
    this.stage.add(layer);

    const image1 = new Image();
    image1.onload =()=> {
        const img = new Konva.Image({
            x: 0,
            image: image1
        });

        layer.add(img);
        layer.batchDraw();
    }

    image1.src = this.photo;
}

// Get the stage to get the images
ReDrawImages.prototype.getImages = function() {
    return this.stage;
}

function DrawImage() {
    this.oImg;

    this.canvas = new fabric.Canvas('photo-canvas', {
        preserveObjectStacking: true,
        selection: false,
        width: 320,
        height: 320
    });
}

DrawImage.prototype._dispose = function() {
    this.canvas.dispose();
}

DrawImage.prototype._setFrame = function(frameURL) {
    fabric.Image.fromURL(frameURL, function(frame) {
        frame.set({
            evented: false
        });
        this.canvas.add(frame);
    }.bind(this));
}

DrawImage.prototype._setImage = function(image) {
    fabric.Image.fromURL(image, function(img) {
        this.oImg = img.set({
            x: 320 /2,
            y: 320 / 2,
            left: 320 /2,
            top: 320 / 2,
            hasControls: false,
            hasBorders: false,
            originX: 'center',
            originY: 'center'
        }).scale(0.8);

        this.canvas.add(this.oImg);
        this.canvas.setActiveObject(this.oImg);
        this.canvas.renderAll();
        this.canvas.sendToBack(this.oImg);
    }.bind(this));
}

DrawImage.prototype._setCanvas = function() {
    this.canvas = new fabric.Canvas('photo-canvas', {
        preserveObjectStacking: true,
        selection: false,
        width: 320,
        height: 320
    });
}

DrawImage.prototype._action = function(action) {
    const img = this.oImg;
    switch(action) {
        case 'move-left':
            img.set({'left': img.left-5});
            break;
        case 'move-right':
            img.set({'left': img.left+5});
            break;
        case 'move-up':
            img.set({'top': img.top-5});
            break;
        case 'move-down':
            img.set({'top': img.top+5});
            break;
        case 'zoom-big':
            img.set({'scaleX': img.scaleX+(img.scaleX * 0.05), 'scaleY': img.scaleY+(img.scaleY * 0.05)});
            break;
        case 'zoom-small':
            img.set({'scaleX': img.scaleX-(img.scaleX * 0.05), 'scaleY': img.scaleY-(img.scaleY * 0.05)});
            break;
        case 'pinch-big':
            img.set({'scaleX': img.scaleX+(img.scaleX * 0.01), 'scaleY': img.scaleY+(img.scaleY * 0.01)});
            break;
        case 'pinch-small':
            img.set({'scaleX': img.scaleX-(img.scaleX * 0.01), 'scaleY': img.scaleY-(img.scaleY * 0.01)});
            break;
        case 'rotate-left':
            img.set({'angle': img.angle-5});
            break;
        case 'rotate-right':
            img.set({'angle': img.angle+5});
            break;
    }

    
    this.canvas.renderAll();
}


