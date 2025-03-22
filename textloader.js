// ## Todos ##
// having an external .txt file is not ideal. CORS issues. Not sure if this will work on GitHub.io but it should.
// 12/4/24 I tested this and it works with some modification to the url for the text file.

// extract and write in answers? this might require add.dom
// save data of text in rectange? Drag and drop needs to have each 1 answer,
// - completed
// todo: score displayed
// - a progress bar might be better instead of a number
// todo: responsive? no
// - yes. this will auto resize. Haven't checked it on the phone
// todo: average the width from each box, completed.
// todo: nice graphic frame around the outside
// - load a background image as a test.
// todo: fix text centering inside of drag block, complete. 
// fix the seperation of words for inside {{word}}
// todo: goofy thing happens to box size if it is the last word in the block. Its height property is taller. to last word size box.
// --fixed
// todo: dropping item outside of boxes doesn't bring it back to tray
// -- catch all container resets content now
// todo: after a drop, wrong or not, put a question graphic on the drop item
// --used a "?" mark
// todo: status block created to show how many answers are left
// --complete
// todo: there needs to be a submit button to check answers
// -- submit was added
// todo: add a reset button to reset the scene
// todo: add a submit button
// todo: add a score area
// todo: fix ordering during drag and drop
// todo: into, enter name, record score in google doc
// todo: fix the multiple occupancy problem on drop targets
// todo: fix the status of submit when item is returned
// todo: when there is only 1 drag item the tray disappears
class Text extends Phaser.Scene
{
  preload (){
    this.load.text('sent', 'https://toddmez.github.io/text2.txt');
    this.load.bitmapFont('bmfont', 'https://toddmez.github.io/assets/retrotech/retrotech.png', 'https://toddmez.github.io/assets/retrotech/retrotech.xml');
    this.load.audio('return', 'https://toddmez.github.io/assets/sound.wav');
    this.load.audio('drop', 'https://toddmez.github.io/assets/drop1.mp3');
    this.load.image('background', 'https://toddmez.github.io/assets/background.png');
  }

  getWidth(item){
    return item.getBounds().width;
  }
  getHeight(item){
    return item.getBounds().height;
  }
  getContRightSideX(container){
    let center = container.x
    let width = container.getBounds().width
    return ((width / 2) + center);
  }
 
  create (){

  function answerCount(){
    let value = lower_container.getAll("type", "Container", 0);
    return value.length; 
  }

  let data = this.cache.text.get('sent');
  data = data.replace('\r', ' ').replace('\n', ' ');
  
  const words = data.split(" ");
  const temp_container = this.add.container(25, 25);
  let max_word_width = 0;
  let min_word_width = 1000;
  let font_tracking = 8;
  let font_size = 25;
  let main_x = 70;
  let main_y = 70;
  let answers = 0;
  let background_color = 0x1e234d;
  let debugframe = 1;
         
let catch_all_cont = this.add.container(0, 0);
catch_all_cont.name = "catch_all_cont";

let catch_all_rect = this.add.rectangle(0, 0, 800, 1000, background_color, 1);
  catch_all_rect.setInteractive({dropZone: true});
  catch_all_rect.name = "catch_all_rect";
  catch_all_rect.x = catch_all_rect.width / 2;
  catch_all_rect.y = catch_all_rect.height / 2;
  
let background_image = this.add.image(400, 300, 'background'); 
  
catch_all_cont.add([catch_all_rect, background_image]);
catch_all_cont.visible = true;
//catch_all_container.add([background_image]);

   // ## 1 ## [temp_container] loop through to get max_word_width for drag items
  for (let i = 0, x = 0, y = 50; i < words.length; i++){
   let text = this.add.text(x, y, words[i],{ 
     fontFamily: 'Arial',
     fontSize: `${font_size}px`    
  });      
    if (words[i].match(/{[\w\s]{1,25}}/)){
      answers = answers + 1; 
      const rect = this.add.rectangle(text.getCenter().x, text.getCenter().y, this.getWidth(text), this.getHeight(text), 0xbb00ff);
      let width = text.getBounds().width;
      if (width > max_word_width) {max_word_width = width;} // keep highest 
      if (width < min_word_width) {min_word_width = width;} // keep smallest
      temp_container.add(rect)
    }
  temp_container.add(text);
  temp_container.destroy();
  }
   // ## 1 END ##
   // --------------------------------------
   // # Upper Block / paragraph with questions
   // --------------------------------------
    
  let top_container = this.add.container(main_x, main_y);
  top_container.name = "top_cont";
  const frame_width = 600;
  const frame_height = 200; //starting value
  let choices = [];
  let max_frame_length = 0;
  let max_frame_width = 0;
  let line_spacing = 36;
          
  for (let i = 0, x = 0, y = 0; i < words.length; i++){ //split on space char

    let text = this.add.bitmapText(x, y, 'bmfont', words[i]);
    //text.setFontSize(font_size);
    text.setTintFill(0xffffff);
    //text.setTint(0xff4136, 0xffdc00, 0x2ecc40, 0x0074d9);
    //let text = this.add.text(x, y, words[i], {fontFamily: 'Arial', fontSize:`${font_size}px`}); // add word at 0, 0
    // if bracketed {}, create a block, make dropZone
    if (words[i].match(/\{[\w\s-"]+\}/)){
      const rect = this.add.rectangle(text.getCenter().x, text.getCenter().y, this.getWidth(text), this.getHeight(text), 0xbb0033);
      rect.setInteractive({dropZone: true});
      rect.fillAlpha = 1;
      let clean_word = text.text.replace('{','').replace('}','').replace('.','').replace(',','');
      rect.name = clean_word;
      text.name = clean_word;
      rect.setData('question', clean_word);
      choices.push(clean_word);
      top_container.add([text, rect]);
      //--------------------------------------------------
      //# DropZone Inputs
      //--------------------------------------------------
      rect.on('pointerover', () =>
      {
      //console.log('over');
      });
      rect.on('pointerout', () =>
      {
      //console.log('out');
      });
      this.input.on('dragleave', (pointer, dragObject, dropZone) => {})
      this.input.on('dragover', (pointer, dragObject, dropZone) => {})
      this.input.on('drop', (pointer, dragObject, dropZone) => {
        if (dropZone.name == 'main_story_background' || dropZone.name == 'catch_all_rect'){ // return drop item to origin
          var question_object = dragObject.getByName('status_question');
          var frame_object = dragObject.getByName('status_frame');
          const tween1 = this.tweens.add({
            targets: question_object,
            scale: 1,
            alpha: 0,
            ease: 'Linear', 
            duration: 250, 
            repeat: 0
          });
          const tween2 = this.tweens.add({
            targets: frame_object,
            alpha: 0,
            ease: 'Linear', 
            duration: 250, 
            repeat: 0
          });
          lower_container.add([dragObject]);
          dragObject.x = dragObject.data.values['x'];
          dragObject.y = dragObject.data.values['y'];
          score_num.text = answerCount(); 
          if (score_num.text == 0){score_text_sub_1.visible = false;score_sub_rect_1.visible = false;}
          var sound = this.sound.add('return');
          let audio_conf_1 = {
            mute: false, 
            loop: false, 
            rate: 1, 
            volume: .3}
          sound.play(audio_conf_1);

        } // end catch all
        else if (dropZone.data.values['question'] == dragObject.data.values['answer']){ // match. 
          console.log('match');
          score_num.text = answerCount(); // update score with count of left in lower tray      
          if (score_num.text == 0){score_text_sub_1.visible = true;score_sub_rect_1.visible = true;}
          top_container.add([dragObject]); 
          dragObject.x = dropZone.getTopLeft().x;
          dragObject.y = dropZone.getTopLeft().y;
          var question_object = dragObject.getByName('status_question');
          var frame_object = dragObject.getByName('status_frame');
          const tween1 = this.tweens.add({ //fade the ? in
            targets: question_object,
            scale: 1,
            alpha: 1,
            ease: 'Linear', 
            duration: 150, 
            repeat: 0
          });
          const tween2 = this.tweens.add({ //fade the frame in
            targets: frame_object,
            alpha: 1,
            ease: 'Linear', 
            duration: 150, 
            repeat: 0});
          var sound = this.sound.add('drop');
            let audio_conf_1 = {
              mute: false, 
              loop: false, 
              rate: 1, 
              volume: .3}
            sound.play(audio_conf_1);
          } // end else
        else if (dropZone.data.values['question'] !== dragObject.data.values['answer']){ // no match. 
          console.log('no match');
          score_num.text = answerCount();
          if (score_num.text == 0){score_text_sub_1.visible = true;score_sub_rect_1.visible = true;}
          var anchorx = score_num.x
          var anchory = score_num.y
          score_num.alpha = 0;
          score_num.scale = 3;
          
          const tween10 = this.tweens.add({ //scale in the score in
            targets: score_num,
            scale: 1,
            alpha: 1,
            ease: 'Linear', 
            duration: 350, 
            repeat: 0
          });

          top_container.add([dragObject]); 
          dragObject.x = dropZone.getTopLeft().x;
          dragObject.y = dropZone.getTopLeft().y;
          var question_object = dragObject.getByName('status_question');
          var frame_object = dragObject.getByName('status_frame');
                
          const tween1 = this.tweens.add({
            targets: question_object,
            scale: 1,
            alpha: 1,
            ease: 'Linear', 
            duration: 150, 
            repeat: 0
          });
          const tween2 = this.tweens.add({
            targets: frame_object,
            alpha: 1,
            ease: 'Linear', 
            duration: 150, 
            repeat: 0
          });
        }
        else {  
          top_container.add([dragObject]); 
          dragObject.x = dropZone.getTopLeft().x;
          dragObject.y = dropZone.getTopLeft().y;
          score_num.text = answerCount()
          if (score_num.text == 0){score_text_sub_1.visible = true;score_sub_rect_1.visible = true;}

        }
      });
      rect.setSize(max_word_width, 26);
      // tracking for the bracketed word
      text.x = text.x + font_tracking + (max_word_width - this.getWidth(text)) / 2;
      rect.x = rect.x + font_tracking + (max_word_width - this.getWidth(text)) / 2;
      // tracking after the bracketed word
      x = text.getBottomRight().x + font_tracking + (max_word_width - this.getWidth(text)) / 2;
    }
    // --------------------------------------
    // Wraps text to next line
    // --------------------------------------
    else {
      top_container.add(text);
      x = text.getBottomRight().x + font_tracking; // default move
    }
    if (text.getBottomRight().x > frame_width) { // wrap text
      y = y + line_spacing;
      x = 0;
    }
    if (text.getBottomRight().x > max_frame_width){
      max_frame_width = text.getBottomRight().x; //store maximum text width value
    }
  }
  const main_story_bg_frame = this.add.graphics(); // Red frame for top block
  main_story_bg_frame.lineStyle(2, 0xff0000, debugframe);
  
  let lastItem = top_container.last;
  //-------------------------------------------------- 
  // ## Loop through top_container items store largest Y value 
  //-------------------------------------------------- 
  let top_cont_list = top_container.list;
  for (var i = 0; i < top_cont_list.length; i++){
    if (top_cont_list[i].type == 'BitmapText' && top_cont_list[i].getBottomRight().y > max_frame_length){
    max_frame_length = top_cont_list[i].getBottomRight().y;
    }
  }
 
  //---------------------------------------------------
  // ## Create background rectangle for the main story
  //---------------------------------------------------
  let main_story_bg_rect = this.add.rectangle(0, 0, max_frame_width, max_frame_length, 0x00aaaa);
  main_story_bg_rect.x = max_frame_width / 2;
  main_story_bg_rect.y = max_frame_length / 2;
  main_story_bg_rect.alpha = 0;
  main_story_bg_rect.setInteractive({dropZone: true});
  main_story_bg_rect.name = "main_story_background";
  main_story_bg_frame.strokeRect(0, 0, max_frame_width, max_frame_length); //added here to use max_frame_length 
  top_container.add([main_story_bg_rect, main_story_bg_frame]); // add to upper container
  top_container.sendToBack(main_story_bg_rect);
  // --------------------------------------
  // # Lower Answer Tray Container
  // --------------------------------------
  choices.sort(); // # "Randomize" answer tray Array
  const lower_container = this.add.container(main_x, main_y + max_frame_length + 50);
  lower_container.name = 'answer_tray_container';
  
  let lineArray = [0, 35, 70, 105];
  for (let i = 0, x = 0, y = 0, ln = 0; i < choices.length; i++){
    const text = this.add.text(x, y, choices[i], {
      fontFamily: 'Arial',
      fontSize: `${font_size}px`, 
      weight: 400,
      padding: {x: 0, y: 0 , left: 0, right: 0, top: 0, bottom: 0}
    });
    text.name = 'text';      
    const text_bg = this.add.rectangle(text.getCenter().x, text.getCenter().y, max_word_width, this.getHeight(text), 0x000000);
    
    const drag_items_cont = this.add.container(x, y);
    
    const drag_item_vfx_2 = this.add.graphics();
    drag_item_vfx_2.name = 'status_frame';
    drag_item_vfx_2.lineStyle(1, 0xffffff, 1); // thck, color, alpha: drop item frame
    drag_item_vfx_2.strokeRect(0, 0, max_word_width, 25);
    drag_item_vfx_2.setAlpha(0);

    const drag_item_status_cont = this.add.container(0, 0); // drop item status: ?
    drag_item_status_cont.setAlpha(0);
    drag_item_status_cont.scale = 0;
    drag_item_status_cont.name = 'status_question';
    const text_status = this.add.text(0, 0, "?", {fontFamily: 'Arial', fontSize: `${font_size}px`, color: '#000'});
    //const text_status_bg = this.add.rectangle(max_word_width, 0, 20, 20, 0xdddd00);
    const text_status_bg = this.add.circle(text_status.x, text_status.y, 10, 0xdddd00);
    text_status_bg.x = text_status.height - text_status_bg.width;
    text_status_bg.x = text_status.height - text_status_bg.width;
    text_status_bg.y = text_status.width;
    drag_item_status_cont.add([text_status_bg, text_status]);

    const drag_item_vfx_1 = this.add.rectangle(drag_item_vfx_2.x + max_word_width / 2, 
    (drag_item_vfx_2.y + this.getHeight(text) / 2), max_word_width, this.getHeight(text), 0x4b32b2); // drop item highlight
    drag_item_vfx_1.name = 'hover_highlight';
    drag_item_vfx_1.blendMode = 'ADD';
    drag_item_vfx_1.visible = false;

    drag_items_cont.add([text_bg, text, drag_item_vfx_1, drag_item_vfx_2, drag_item_status_cont]); 
    
    drag_items_cont.name = choices[i] //gives name    
    drag_items_cont.setData('answer', choices[i]); 
    text_bg.setPosition(drag_item_vfx_2.x + max_word_width / 2, (drag_item_vfx_2.y + this.getHeight(text) / 2));
    // this needs centering
    text.setPosition(drag_item_vfx_2.x + max_word_width / 10, drag_item_vfx_2.y);
    
    drag_item_status_cont.x = max_word_width - font_tracking; //adjust placement of status
    drag_item_status_cont.y = -this.getHeight(text) / 2; //adjust placement of status

    var answr_tray_maxHeight = 0;    
    lower_container.add([drag_items_cont]);
    let container_x = drag_items_cont.getBounds().x + max_word_width; // get x of drag container
    //#-------------------------------#
    // lower tray wrapping of drag_items_containers
    //#-------------------------------#
    if (container_x + this.getWidth(drag_items_cont) > max_frame_width) {
      ln = ln + 1;
      x = 0;
      drag_items_cont.setPosition(x, lineArray[ln]);
      continue;
    }
    // the first word
    if (container_x + this.getWidth(drag_items_cont) < max_frame_width && i == 0){
      x = drag_items_cont.x;
      drag_items_cont.setPosition(x, lineArray[ln]);
      continue;
    }
    else {
    // spacing for answers
    x = drag_items_cont.x + max_word_width + 10;
    drag_items_cont.setPosition(x, lineArray[ln]);
    answr_tray_maxHeight = lineArray[ln] * 2;
    continue;
    } 
  }  // end of lower block loop
  
  // # add answer tray gfx frame 
  const lower_container_gfx = this.add.graphics({
    lineStyle: {width: 1, color: 0xff0000, alpha: debugframe},
    fillStyle: {color: 0x000000, alpha: .3}
  });

  lower_container_gfx.fillRect(0, 0, max_frame_width, answr_tray_maxHeight);
  lower_container_gfx.strokeRect(0, 0, max_frame_width, answr_tray_maxHeight);
  lower_container.add(lower_container_gfx);
  lower_container.sendToBack(lower_container_gfx); // send behind drag items
      
  // --------------------------------------
  // # Lower Answer Tray Container create Interactive Loop
  // --------------------------------------
  for (let i = 0, x = 0, y = 0, ln = 0; i < choices.length; i++){
    let choiceItem = choices[i]; 
    let dragObject = lower_container.getByName(choiceItem);
    dragObject.setInteractive(new Phaser.Geom.Rectangle(0, 0, max_word_width, 25), Phaser.Geom.Rectangle.Contains);
    //-------------------------------------------------- 
    // ## DragObject Inputs
    //-------------------------------------------------- 
    this.input.setDraggable(dragObject);
      dragObject.on('pointerover',() => { 
        dragObject.list[2].visible = true; // reveal hover color
        if (dragObject.parentContainer.name == "answer_tray_container")	{	// on hover item store x, y for reset of item
            dragObject.setData('x', dragObject.x);
            dragObject.setData('y', dragObject.y);
        }
      });
      dragObject.on('pointerout',() => {
        dragObject.list[2].visible = false; //highlight on hover
      });
      this.input.on('drag', (pointer, dragObject, dragX, dragY) => {
        var question_object = dragObject.getByName('status_question'); 
        var frame_object = dragObject.getByName('status_frame'); 
        const tween1 = this.tweens.add({
          targets: question_object, scale: 1,
          alpha: 0,
          ease: 'Linear', 
          duration: 150, 
          repeat: 0
        });
        const tween2 = this.tweens.add({
          targets: frame_object,
          alpha: 0,
          ease: 'Linear', 
          duration: 150, 
          repeat: 0
        });
      dragObject.x = dragX;
      dragObject.y = dragY;
      });
    } // end of interactive loop

  // # ---------------------|---------#
  // # Top Score Container  | Submit 
  // #----------------------|---------#
  
  // << main >>
  const score_main_cnt = this.add.container((main_x + max_frame_width), (main_y - font_size));
  score_main_cnt.name = "score_main_container";
  
  // << remaining container >>
  const score_remaining_cnt = this.add.container(0, 0);
  score_remaining_cnt.name = "score_remaining_cnt_containter";
  const score_bg = this.add.rectangle(0, 0, 150, 26, 0xebbe42, 1);
  const remaining = this.add.text(0, 0, "remaining", {
    fontFamily: 'Arial',
    fontSize: `${font_size}px`,
    fontStyle: 'normal',
    color: '#000'
  });
  const score_num = this.add.text(0, 0, answerCount(), {
    fontFamily: 'Arial',
    fontSize: `${font_size}px`,
    fontStyle: 'bold',
    color: '#FFFFFF', 
    stroke: '#000',
    strokeThickness: 3,
    shadow: {offsetX: 3, offsetY: 3, color: '#000', blur: 4, stroke: false, fill: true},
    padding: {x: 5, y: 5 , left: 5, right: 15, top: 0, bottom: 0},
  });
  score_num.name = "score_number";
  //score_num.alpha = 0; // set score to be invisible

  score_num.x = score_num.x - 35;
  score_num.y = -this.getHeight(score_num) / 2
  remaining.y = -this.getHeight(remaining) / 2; 
  remaining.x = remaining.x - 5;

  score_remaining_cnt.add([remaining, score_num]); 
  
  score_main_cnt.add([score_bg, score_remaining_cnt]); 
  
  score_remaining_cnt.x = score_remaining_cnt.x - 32;
  score_remaining_cnt.y = score_remaining_cnt.y - 1;
  score_main_cnt.x = max_frame_width - (this.getWidth(score_main_cnt) + 10);

// << score >>
  const score_submit = this.add.container(0, 0);
  score_submit.name = "submit";
  
  const score_sub_rect_0 = this.add.rectangle(0, 0, 85, 26, 0xeeeeee, 1);
  const score_sub_rect_1 = this.add.rectangle(0, 0, 85, 26, 0xebbe42, 1);
  
  const score_text_sub_1 = this.add.text(0, 0, "submit", {
    fontFamily: 'Arial',
    fontSize: `${font_size}px`,
    color: '#000'
  });

  const score_text_sub_0 = this.add.text(0, 0, "submit", {
    fontFamily: 'Arial',
    fontSize: `${font_size}px`,
    color: '#000',
    alpha: .3
  });
  
// << submit >>
  score_submit.add([score_sub_rect_0, score_sub_rect_1, score_text_sub_0, score_text_sub_1]);
  score_text_sub_1.y = -this.getHeight(score_text_sub_1) / 2;
  score_text_sub_1.x = score_text_sub_1.x - 34;
  score_text_sub_0.x = score_text_sub_1.x;
  score_text_sub_0.y = score_text_sub_1.y;
  score_submit.x = score_submit.x - 45;
  score_text_sub_1.visible = false;
  score_sub_rect_1.visible = false;
// << add to main >>  
  score_main_cnt.add([score_submit]);

  score_submit.x = this.getWidth(score_remaining_cnt);

  } //end of create loop
   
} // end of the class
       
const config = {
    type: Phaser.AUTO, //Phaser.AUTO
    width: 800,
    height: 600,
    debug: false,
    scene: Text,
    scale: {
    // Or set parent divId here
    //parent: "Turkey",

    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,

    // Or put game size here
    // width: 1024,
    // height: 768,

    // Minimum size
    min: {
        width: 800,
        height: 600
    },
    // Or set minimum size like these
    // minWidth: 800,
    // minHeight: 600,

    // Maximum size
    max: {
        width: 1600,
        height: 1200
    },
    // Or set maximum size like these
    // maxWidth: 1600,
    // maxHeight: 1200,

    zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false
};
const game = new Phaser.Game(config);
