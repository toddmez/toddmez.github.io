// ## ideas ##
// having an external .txt file is not ideal. CORS issues. Not sure if this will work on GitHub.io but it should.
// extract and write in answers? this might require add.dom
// save data of text in rectange? Drag and drop needs to have each 1 answer
// there needs to be a submit button to check answers
// there needs to be a score displayed
// Is this responsive?
// average the width from each box then I would have to move original text to accomodate
// nice graphic frame around the outside

class Text extends Phaser.Scene
{
    preload ()
    {
        this.load.text('sent', 'https://toddmez.github.io/text.txt');
        //this.load.html('shtml', 'http://localhost/phaser/text.html');  
    }

    create ()
    {         
        //https://docs.phaser.io/api-documentation/class/gameobjects-text
        let data = this.cache.text.get('sent');
        console.log(data);
        data = data.replace('\r', '').replace('\n', '');
        const words = data.split(" ");
        const temp_container = this.add.container(25, 25);
        let maxWordWidth = 0;
        let tracking = 8;
        let fsize = 23;

        // ## 1 ## [temp_container] loop through to get maxWordWidthy
        for (let i = 0, x = 0, y = 50; i < words.length; i++){
            let text = this.add.text(x, y, words[i], { 
                fontFamily: 'Arial',
                fontSize: `${fsize}px`    
            });      
            if (words[i].match(/{[\w\s]{1,25}}/)){
                const rect = this.add.rectangle(text.getCenter().x, text.getCenter().y, text.getBounds().width, text.getBounds().height, 0xbb00ff);
                let width = text.getBounds().width;
                // keeping the highest width
                if (width > maxWordWidth) {
                    maxWordWidth = width;
                }
                temp_container.add(rect)
            }
            temp_container.add(text);
        temp_container.destroy();
        }
        // ## 1 END ##

        const container = this.add.container(25, 25);
        const frmWdth = 600;
        const frmHght = 200;
        //const frmHght_choices = 150;

	let choices = [];
	let maxLength = 0;
    let maxWidth = 0;
    let lineSpacing = 35;

    // upper block, loop through words
    for (let i = 0, x = 0, y = 0; i < words.length; i++){

        let text = this.add.text(x, y, words[i], { 
            fontFamily: 'Arial',
            fontSize: `${fsize}px`    
        });
        // if {}, create a block
        if (words[i].match(/{[\w\s]{1,25}}/)){
            // rect is created based of of text loc x,y,w,h
            const rect = this.add.rectangle(text.getCenter().x, text.getCenter().y, text.getBounds().width, text.getBounds().height, 0xbb00ff);
            container.add([rect, text]); // entries in paragraph
            choices.push(text.text.replace('{','').replace('}','').replace('.',''));
            rect.width = maxWordWidth;
            text.width = maxWordWidth;
            x = text.getBottomRight().x + tracking;
        }
        // else word spacing for normal text non bracketed {}
        else {
            container.add(text);
            x = text.getBottomRight().x + tracking; 
        }
        // wrap text
        if (text.getBottomRight().x > frmWdth) {
            y = y + lineSpacing;
            x = 0;
        }
        if (text.getBottomRight().x > maxWidth){
            maxWidth = text.getBottomRight().x;
        }
        
    }

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000, 1);
    maxLength = container.last.getBottomRight().y
    graphics.strokeRect(0, 0, maxWidth, maxLength); 
    container.add(graphics);
    console.log(container);

    console.log(choices);
    const frmHght_choices = 150;

	const answr_tray_container = this.add.container(25, maxLength + 50);
	let lineArray = [0, 35, 70, 105]

    for (let i = 0, x = 0, y = 0, ln = 0; i < choices.length; i++){
        const text = this.add.text(x, y, choices[i], {fontFamily: 'Arial',fontSize: `${fsize}px`});
        const rect = this.add.rectangle(text.getCenter().x, text.getCenter().y, maxWordWidth, text.getBounds().height, 0x000dd);
        rect.setAlpha(0.5);
        const word_container = this.add.container(x, y);
        
        const word_container_gfx = this.add.graphics();
        word_container_gfx.lineStyle(2, 0xff00ff, 1); 
        word_container_gfx.strokeRect(0, 0, maxWordWidth, 25); 

        word_container.add([rect, text, word_container_gfx]);
        rect.setPosition(word_container_gfx.x + maxWordWidth/2, (word_container_gfx.y + text.getBounds().height/2));
        text.setPosition(word_container_gfx.x + maxWordWidth/10, word_container_gfx.y);
        var answr_tray_maxHeight = 0;    
        // word_container is 0, 0 at this point
        answr_tray_container.add([word_container]);
        
        // upper left corner of container
        let container_x = word_container.getBounds().x;
        let container_w = word_container.getBounds().width;
        //console.log(container_x, '+', container_w, '=', container_x + container_w, frmWdth);

        // wrap
	    if (container_x + container_w > maxWidth) {
            ln = ln + 1;
            x = 0;
	    word_container.setPosition(x, lineArray[ln]);
            //console.log(`#1 xpos: ${x}, line: ${ln}, word: ${choices[i]}`);
            continue;
       	}
        // the first word
        if (container_x + container_w < maxWidth && i == 0){
            x = word_container.x;
            word_container.setPosition(x, lineArray[ln]);
            //console.log(`#2 xpos: ${x}, line: ${ln}, word: ${choices[i]}`);
            continue;
        }
        else {
            //spacing for answers
            x = word_container.x + maxWordWidth + 10;
            word_container.setPosition(x, lineArray[ln]);
	    answr_tray_maxHeight = lineArray[ln] * 2;
            //console.log(`#3 xpos: ${x}, line: ${ln}, word: ${choices[i]}`);
            continue;
        } 
	}  // end of for loop    
    const answr_tray_container_gfx = this.add.graphics();
    answr_tray_container_gfx.lineStyle(1, 0xffaaff, 1); 
    answr_tray_container_gfx.strokeRect(0, 0, maxWidth, answr_tray_maxHeight); 
    answr_tray_container.add(answr_tray_container_gfx);
    } //end of create loop
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1000,
    scene: Text,
};

const game = new Phaser.Game(config);
