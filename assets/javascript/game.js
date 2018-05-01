//======================GAME START!!!!!!!!!!!!!!!!!==========================================
$(document).ready(function() {

  //fighters variables
	var characters = {
        'bruceLee': {
            name: 'bruceLee',
            health: 150,
            attack: 25,
            imageUrl: "assets/images/bruce.png",
            enemyAttackBack: 3,
        },

        'donnieYen': {
            name: 'donnieYen',
            health: 180,
            attack: 18,
            imageUrl: "assets/images/yen.png",
            enemyAttackBack: 10,
        }, 

        'jackieChan': {
            name: 'jackieChan',
            health: 200,
            attack: 15,
            imageUrl: "assets/images/chen.png",
            enemyAttackBack: 14,
        }, 

        'jetLi': {
            name: 'jetLi',
            health: 150,
            attack: 10,
            imageUrl: "assets/images/lee.png",
            enemyAttackBack: 8,
        }
  };

	//set varibales
	var selectedFighters;
	var selectedDefenders;
	var turnCounter = 1;
  var killCount = 0;
  var fighters = [];
	
  
  //send varibales to fighter info box
	var fighterInfo = function(character, fighterBox, selectOne) {
		var charDiv = $("<div class='character' data-name='" + character.name + "'>");
		var charName = $("<div class='character-name'>").text(character.name);
		var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
		var charHealth = $("<div class='character-health'>").text(character.health);
		charDiv.append(charName).append(charImage).append(charHealth);
		$(fighterBox).append(charDiv);
		//judge
		if (selectOne == 'enemy') {
		  $(charDiv).addClass('enemy');
		} else if (selectOne == 'defender') {
		  selectedDefenders = character;
		  $(charDiv).addClass('attack');
		}
	};
	
	var inforCollect = function(message) {
		var gameMesageSet = $("#gameMessage");
		var newMessage = $("<div>").text(message);
		gameMesageSet.append(newMessage);
		if (message == 'refresh') {
		  gameMesageSet.text('');
		}
	};

	var renderCharacters = function(charObjects, react) {
      if (react == '#charSection') {
        $(react).empty();
        for (var i in charObjects) {
          if (charObjects.hasOwnProperty(i)) {
            fighterInfo(charObjects[i], react, '');
          }
        }
      }
      
      //call invisible box
      if (react == '#selected-character') {
        $('#selected-character').prepend("Your Character");       
        fighterInfo(charObjects, react, '');
        $('#attack-button').css('visibility', 'visible');
      }

      if (react == '#attackSection') {
        $('#attackSection').prepend("Choose Your Next Opponent");      
        for (var i = 0; i < charObjects.length; i++) {
        fighterInfo(charObjects[i], react, 'enemy');
        }

        $(document).on('click', '.enemy', function() {
    
        name = ($(this).data('name'));

        if ($('#defender').children().length === 0) {
          renderCharacters(name, '#defender');
          $(this).hide();
          inforCollect("refresh");
        }
        });
      }
      
      if (react == '#defender') {
        $(react).empty();
        for (var i = 0; i < fighters.length; i++) {
          if (fighters[i].name == charObjects) {
            $('#defender').append("Your selected opponent")
            fighterInfo(fighters[i], react, 'defender');
          }
        }
      }

      if (react == 'playerDamage') {
        $('#defender').empty();
        $('#defender').append("Your selected opponent")
        fighterInfo(charObjects, '#defender', 'defender');
      }
    
      if (react == 'enemyDamage') {
        $('#selected-character').empty();
        fighterInfo(charObjects, '#selected-character', '');
      }
      
      if (react == 'enemyDefeated') {
        $('#defender').empty();
        var playerCaseMessage = "You have defated " + charObjects.name + ", you can choose to fight another enemy.";
        inforCollect(playerCaseMessage);
      }
	  };
	  
	  renderCharacters(characters, '#charSection');
	  $(document).on('click', '.character', function() {
		name = $(this).data('name');
      if (!selectedFighters) {
          selectedFighters = characters[name];
          for (var i in characters) {
          if (i != name) {
            fighters.push(characters[i]);
          }
        }
        
        $("#charSection").hide();
        renderCharacters(selectedFighters, '#selected-character');
        renderCharacters(fighters, '#attackSection');
      }
	  });
	
	 //attack-button effect
	  $("#attack-button").on("click", function() {
	
		if ($('#defender').children().length !== 0) {
	
		  var attackMessage = "You attacked " + selectedDefenders.name + " for " + (selectedFighters.attack) + " damage.";
		  inforCollect("refresh");
		  //defender HP
		  selectedDefenders.health = selectedDefenders.health - (selectedFighters.attack);
	
		  if (selectedDefenders.health > 0) {
        renderCharacters(selectedDefenders, 'playerDamage');
        var counterAttackMessage = selectedDefenders.name + " attacked you back for " + selectedDefenders.enemyAttackBack + " damage.";
        
        inforCollect(attackMessage);
        inforCollect(counterAttackMessage);
        
        selectedFighters.health = selectedFighters.health - selectedDefenders.enemyAttackBack;
        
        renderCharacters(selectedFighters, 'enemyDamage');
          if (selectedFighters.health <= 0) {
            inforCollect("refresh");
            restartGame("GOODBYE LOSER...GAME OVER!!!");
            $("#attack-button").unbind("click");
          }
		  } else {
			renderCharacters(selectedDefenders, 'enemyDefeated');
			killCount++;
        if (killCount >= 3) {
          inforCollect("refresh");
          restartGame("YOU SURVIVED!!!");
        }
		  }
		  turnCounter++;
      } else {
        inforCollect("refresh");
        inforCollect("Select One, Coward...");
      }
	  });
	
	  var restartGame = function(oneMore) {
      var restart = $('<button class="btn">Restart</button>').click(function() {
        location.reload();
      });
      var playerCase = $("<div>").text(oneMore);
      $("#gameMessage").append(playerCase);
      $("#gameMessage").append(restart);
      };
    });