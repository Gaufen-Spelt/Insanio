(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
  ui = dendryUI;
  game = ui.game;
};

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showCreds = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('credits')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('credits');
    }
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
    window.populateIntroOption();
  };

  window.displayPinnedCards = function(cards) {
    if (cards.length === 0) return null;
    var $cardsEl = $('<ul>').addClass('pinned-cards');
    for (var card of cards) {
        var $cardEl = $('<li>').addClass('pinned-card');
        var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
        var $title = $('<span>').addClass('card-caption').text(card.title);
        if (card.image) {
            $cardLink.append($('<img>').addClass('card-img').attr({src: card.image}));
        }
        if (card.subtitle) {
            $cardLink.append($('<span>').addClass('card-tooltip').text(card.subtitle));
        }
        $cardEl.append($cardLink).append($title);
        $cardsEl.append($cardEl);
    }
    $('#content').append($cardsEl);
};

window.displayHand = function(hand, maxCards) {
    if (!hand || hand.length === 0) return null;
    var $handEl = $('.hand');
    if ($handEl.length === 0) {
        $handEl = $('<ul>').addClass('hand');
    } else {
        $handEl.empty();
    }
    for (var i = 0; i < maxCards; i++) {
        var $cardEl = $('<li>').addClass('card-in-hand');
        if (hand[i]) {
            var card = hand[i];
            var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
            var $title = $('<span>').addClass('card-caption').text(card.title);
            if (card.image) {
                $cardLink.append($('<img>').addClass('card-img').attr({src: card.image}));
            }
            if (card.subtitle) {
                $cardLink.append($('<span>').addClass('card-tooltip').text(card.subtitle));
            }
            $cardEl.append($cardLink).append($title);
        } else {
            $cardEl.append($('<div>').addClass('blank-card'));
        }
        $handEl.append($cardEl);
    }
    $('#content').append($handEl);
};

window.displayDecks = function(decks) {
    if (!decks || decks.length === 0) return null;
    var $decksEl = $('<ul>').addClass('decks');
    for (var deck of decks) {
        var $deckEl = $('<li>').addClass('deck');
        var $deckLink = $('<a>').addClass('card').attr({href: '#', 'card-id': deck.id, title: deck.title});
        var $title = $('<span>').addClass('card-caption').text(deck.title);
        if (deck.image) {
            $deckLink.append($('<img>').addClass('card-img').attr({src: deck.image}));
        }
        if (deck.subtitle) {
            $deckLink.append($('<span>').addClass('card-tooltip').text(deck.subtitle));
        }
        if (!deck.canChoose) {
            $deckEl.addClass('unavailable-card');
        }
        $deckEl.append($deckLink).append($title);
        $decksEl.append($deckEl);
    }
    $('#content').append($decksEl);
};

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
    console.log(window.dendryUI.dendryEngine.state.sceneId);
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
    window.updateSidebar();

    // Also clean main content
    $('#content p').each(function() {
        var text = $(this).text().trim();
        if (text === '' || text === '\u00B7' || text === '.') {
            $(this).remove();
        }
    });
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };

  window.hideSidebarAndNotebook = function() {
    document.getElementById('stats_sidebar').style.display = 'none';
    document.getElementById('notebook').style.display = 'none';
    document.getElementById('page').style.gridTemplateColumns = '0 1fr 0';
};

window.showSidebarAndNotebook = function() {
    document.getElementById('stats_sidebar').style.display = '';
    document.getElementById('notebook').style.display = '';
    document.getElementById('page').style.gridTemplateColumns = '';
};


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
    window.hideSidebarAndNotebook();

    // Show intro unless disabled
    var introDisabled = false;
    try { introDisabled = localStorage.getItem('intro_disabled') === '1'; } catch(e) {}
    if (introDisabled) {
        document.getElementById('intro-overlay').style.display = 'none';
    } else {
        window.startIntro();
    }

    // Sync options radio
    window.populateIntroOption();
};

window.startIntro = function() {
    var overlay = document.getElementById('intro-overlay');
    overlay.style.display = 'block';
    overlay.style.opacity = '1';

    var words = [
        'SUBJECT 7', 'DO NOT REMEMBER', 'SPECIMEN', 'EXIT', 'WHO ARE YOU',
        'CONTAINMENT', 'LEVEL 4', 'DO NOT LOOK', 'RUN', 'PROCEDURE 9',
        'THEY KNOW', 'FORGET', 'AUTHORIZED', 'CONTAMINATED', 'BREATHE',
        'SECTOR C', 'ANOMALY', 'ERROR', 'STAY STILL', 'RECORD',
        'IT WORKED', 'ALMOST', 'OVERRIDE', 'DO NOT OPEN', 'HELP',
        'CLASSIFIED', '????', 'YES', 'NO', 'AGAIN'
    ];

    var sizes = ['0.7em', '0.9em', '1.1em', '1.4em', '1.8em', '2.4em', '0.55em'];
    var dismissed = false;

    var dismiss = function() {
    if (dismissed) return;
    dismissed = true;
    
    // Spawn words faster briefly, then fade
    var burst = 0;
    var burstInterval = setInterval(function() {
        if (burst++ > 12) {
            clearInterval(burstInterval);
            overlay.classList.add('fade-out');
            setTimeout(function() { overlay.style.display = 'none'; }, 1050);
        }
        var el = document.createElement('span');
        el.className = 'intro-word';
        el.textContent = '...';
        el.style.left = Math.random() * 90 + '%';
        el.style.top  = Math.random() * 90 + '%';
        el.style.fontSize = '2em';
        el.style.animationDuration = '300ms';
        overlay.appendChild(el);
    }, 60);
};

    overlay.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss, { once: true });
    setTimeout(dismiss, 9000);

setTimeout(function() {
    if (dismissed) return;
    overlay.classList.add('intro-ending');
    overlay.style.transition = 'opacity 2s ease';  // slow fade over remaining 2s
    overlay.style.opacity = '0.01';                // near-zero but not gone yet
}, 7000);

setTimeout(dismiss, 9000);

    var spawnWord = function() {
        if (dismissed) return;
        var el = document.createElement('span');
        el.className = 'intro-word';
        el.textContent = words[Math.floor(Math.random() * words.length)];
        el.style.left = Math.random() * 90 + '%';
        el.style.top  = Math.random() * 90 + '%';
        el.style.fontSize = sizes[Math.floor(Math.random() * sizes.length)];
        el.style.opacity = String(0.2 + Math.random() * 0.8);
        var duration = 400 + Math.random() * 1200;
        el.style.animationDuration = duration + 'ms';
        overlay.appendChild(el);
        setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, duration);
        setTimeout(spawnWord, 80 + Math.random() * 220);
    };

    spawnWord();
};
window.enableIntro = function() {
    try { localStorage.removeItem('intro_disabled'); } catch(e) {}
};

window.disableIntro = function() {
    try { localStorage.setItem('intro_disabled', '1'); } catch(e) {}
};

window.populateIntroOption = function() {
    var introDisabled = false;
    try { introDisabled = localStorage.getItem('intro_disabled') === '1'; } catch(e) {}
    var yes = document.getElementById('intro_yes');
    var no  = document.getElementById('intro_no');
    if (yes && no) {
        yes.checked = !introDisabled;
        no.checked  =  introDisabled;
    }
};











// =============================================
// RETRO PC MODE
// window.bootPC()   — triggers CRT boot → Win98
// window.revertPC() — triggers shutdown → restore
// =============================================

  // ---------- taskbar clock ----------
  var _clockInterval = null;
  function _startClock() {
    var el = document.getElementById('retro-clock');
    if (!el) return;
    function tick() {
      var now = new Date();
      var h = now.getHours(), m = now.getMinutes();
      var ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      el.textContent = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }
    tick();
    _clockInterval = setInterval(tick, 10000);
  }
  function _stopClock() {
    clearInterval(_clockInterval);
    _clockInterval = null;
  }

  // ---------- inject persistent DOM elements once ----------
  function _ensureRetroDOM() {
    if (document.getElementById('pc-boot-overlay')) return;

    // Boot/POST overlay
    var boot = document.createElement('div');
    boot.id = 'pc-boot-overlay';
    boot.innerHTML =
      '<div class="scanlines"></div>' +
      '<div class="crt-flicker"></div>' +
      '<div id="pc-boot-screen"></div>' +
      '<div class="bios-bar">' +
        '<span>Award Modular BIOS v4.51PG</span>' +
        '<span>Press DEL to enter SETUP</span>' +
      '</div>';
    document.body.appendChild(boot);

    // Taskbar
    var tb = document.createElement('div');
    tb.id = 'retro-taskbar';
    tb.innerHTML =
      '<button id="retro-start-btn" onclick="window.revertPC()">⊞ Start</button>' +
      '<div id="retro-active-window">Insanio: The Beginnings</div>' +
      '<div id="retro-clock">12:00 PM</div>';
    document.body.appendChild(tb);

    // Window controls injected into header title bar
    var hdr = document.querySelector('header');
    if (hdr && !document.getElementById('retro-window-controls')) {
      var wc = document.createElement('div');
      wc.id = 'retro-window-controls';
      wc.innerHTML =
        '<div class="retro-wc-btn" title="Minimize">_</div>' +
        '<div class="retro-wc-btn" title="Maximize">□</div>' +
        '<div class="retro-wc-btn" title="Close" onclick="window.revertPC()">✕</div>';
      hdr.appendChild(wc);
    }

    // Shutdown overlay
    var sd = document.createElement('div');
    sd.id = 'retro-shutdown';
    sd.innerHTML =
      '<div class="shutdown-msg">' +
        '<p><strong>Windows is shutting down.</strong></p>' +
        '<p>Please wait while your computer shuts down...</p>' +
      '</div>';
    document.body.appendChild(sd);
  }

  // ---------- BOOT sequence ----------
  var POST_LINES = [
    'Award Modular BIOS v4.51PG, An Energy Star Ally',
    'Copyright (C) 1984-1999, Award Software, Inc.',
    '',
    'ASUS P2B-LS ACPI BIOS Revision 1011',
    '',
    'CPU : Intel Pentium II 350MHz',
    'Memory Test : ######## K OK',
    '',
    'Detecting Primary Master ... ST38421A',
    'Detecting Primary Slave  ... ATAPI CD-ROM',
    '',
    'Press DEL to enter SETUP, ESC to skip memory test',
    '',
    'Starting Windows 98...',
    '',
    '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░',
  ];

  window.bootPC = function() {
    _ensureRetroDOM();

    var overlay = document.getElementById('pc-boot-overlay');
    var screen  = document.getElementById('pc-boot-screen');
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    screen.textContent = '';

    var lineIdx = 0;
    function printNextLine() {
      if (lineIdx >= POST_LINES.length) {
        // Flash to white then reveal Win98 mode
        setTimeout(function() {
          overlay.style.transition = 'opacity 0.15s';
          overlay.style.opacity = '0';
          setTimeout(function() {
            overlay.style.display = 'none';
            overlay.style.transition = '';
            document.body.classList.add('retro-pc-mode');
            _startClock();
            // Brief "screen on" flash
            document.body.style.transition = 'filter 0.3s';
            document.body.style.filter = 'brightness(2)';
            setTimeout(function() { document.body.style.filter = ''; }, 300);
          }, 200);
        }, 900);
        return;
      }

      // Typing effect for last line (progress bar), instant for others
      var line = POST_LINES[lineIdx];
      lineIdx++;

      if (lineIdx === POST_LINES.length) {
        // Animate the progress bar
        var bar = '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░';
        var filled = '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓';
        screen.textContent += '\n';
        var barEl = document.createElement('span');
        barEl.textContent = bar;
        barEl.style.color = '#0f0';
        screen.appendChild(barEl);
        var steps = 0;
        var barInt = setInterval(function() {
          steps++;
          var prog = Math.min(steps * 3, 30);
          barEl.textContent = filled.slice(0, prog) + '░'.repeat(30 - prog);
          if (steps >= 10) {
            clearInterval(barInt);
            printNextLine();
          }
        }, 120);
      } else {
        screen.textContent += line + '\n';
        setTimeout(printNextLine, 60 + Math.random() * 80);
      }
    }

    printNextLine();
  };

  // ---------- REVERT / shutdown ----------
  window.revertPC = function() {
    if (!document.body.classList.contains('retro-pc-mode')) return;

    var sd = document.getElementById('retro-shutdown');
    sd.classList.add('active');

    setTimeout(function() {
      // Flicker off
      sd.style.transition = 'opacity 0.5s';
      sd.style.opacity = '0';
      setTimeout(function() {
        sd.classList.remove('active');
        sd.style.opacity = '';
        sd.style.transition = '';
        document.body.classList.remove('retro-pc-mode');
        _stopClock();
        // Subtle fade-back
        document.body.style.transition = 'filter 0.4s';
        document.body.style.filter = 'brightness(0)';
        setTimeout(function() {
          document.body.style.filter = '';
          setTimeout(function() { document.body.style.transition = ''; }, 400);
        }, 80);
      }, 600);
    }, 1800);
  };



  setInterval(function() {
  var q = game && game.qualities;
  if (q) {
    q['tick'] = (q['tick'] || 0) + 1;
    var el = document.querySelector('#tick-display');
    if (el) el.textContent = q['tick'];
  }
}, 1000);

}());
