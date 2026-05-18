// =============================================================
//  Dendry Inventory System
//  Drop this file in before game.js, or paste into game.js.
//  Requires jQuery (already present in Dendry).
// =============================================================

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // CONFIG — edit these to match your game
  // ------------------------------------------------------------------
  var INV_QUALITY = 'inv_data';   // Dendry quality used to persist inventory
  var MAX_STACK   = 99;           // max quantity per item slot
  var INV_TITLE   = 'Inventory';  // panel heading

  // ------------------------------------------------------------------
  // Item registry — define every item the game can award here.
  // Keys are item IDs referenced in Dendry scripts.
  // ------------------------------------------------------------------
  var ITEMS = {
    gold_coin:   { name: 'Gold Coin',    icon: '🪙', desc: 'Shiny currency.' },
    bread:       { name: 'Bread',        icon: '🍞', desc: 'Stale but edible.' },
    key:         { name: 'Iron Key',     icon: '🗝️', desc: 'Opens something.' },
    letter:      { name: 'Letter',       icon: '✉️', desc: 'A sealed letter.' },
    sword:       { name: 'Sword',        icon: '⚔️', desc: 'A trusty blade.' },
  };

  // ------------------------------------------------------------------
  // Internal state
  // ------------------------------------------------------------------
  var _items = {};   // { itemId: quantity }

  // ------------------------------------------------------------------
  // Core API  (window.inv)
  // ------------------------------------------------------------------
  var inv = {

    // ---- read -------------------------------------------------------

    count: function (itemId) {
      return _items[itemId] || 0;
    },

    has: function (itemId, qty) {
      return this.count(itemId) >= (qty || 1);
    },

    // ---- write ------------------------------------------------------

    add: function (itemId, qty) {
      qty = qty || 1;
      if (!ITEMS[itemId]) {
        console.warn('inv.add: unknown item "' + itemId + '"');
        return;
      }
      _items[itemId] = Math.min((_items[itemId] || 0) + qty, MAX_STACK);
      _sync();
      _render();
    },

    remove: function (itemId, qty) {
      qty = qty || 1;
      if (!_items[itemId]) return false;
      _items[itemId] -= qty;
      if (_items[itemId] <= 0) delete _items[itemId];
      _sync();
      _render();
      return true;
    },

    clear: function () {
      _items = {};
      _sync();
      _render();
    },

    // ---- save/load helpers (called by game.js hooks) ----------------

    _restore: function (jsonString) {
      try {
        _items = JSON.parse(jsonString) || {};
      } catch (e) {
        _items = {};
      }
      _render();
    },

    // expose for debugging
    _items: _items,
  };

  // ------------------------------------------------------------------
  // Sync inventory into Dendry quality so it's part of the save state
  // ------------------------------------------------------------------
  function _sync () {
    var engine = window.dendryUI && window.dendryUI.dendryEngine;
    if (!engine) return;
    engine.state.qualities[INV_QUALITY] = JSON.stringify(_items);
    // keep the public _items reference fresh
    inv._items = _items;
  }

  // ------------------------------------------------------------------
  // Render the inventory panel
  // ------------------------------------------------------------------
  function _render () {
    var $panel = $('#inv-panel');
    if (!$panel.length) return;

    var $list = $panel.find('.inv-list');
    $list.empty();

    var ids = Object.keys(_items);
    if (ids.length === 0) {
      $list.append('<li class="inv-empty">No items.</li>');
      return;
    }

    ids.forEach(function (id) {
      var def = ITEMS[id] || { name: id, icon: '📦', desc: '' };
      var qty = _items[id];
      var $li = $(
        '<li class="inv-item" title="' + def.desc + '">' +
          '<span class="inv-icon">' + def.icon + '</span>' +
          '<span class="inv-name">' + def.name + '</span>' +
          '<span class="inv-qty">×' + qty + '</span>' +
        '</li>'
      );
      $list.append($li);
    });
  }

  // ------------------------------------------------------------------
  // Build the DOM panel (injected once on load)
  // ------------------------------------------------------------------
  function _buildPanel () {
    if ($('#inv-panel').length) return;

    var $panel = $(
      '<div id="inv-panel">' +
        '<h3 class="inv-title">' + INV_TITLE + '</h3>' +
        '<ul class="inv-list"></ul>' +
      '</div>'
    );

    // Append to sidebar if it exists, else after #content
    var $sidebar = $('#sidebar, #qualities, .sidebar').first();
    if ($sidebar.length) {
      $sidebar.append($panel);
    } else {
      $('#content').after($panel);
    }

    _render();
  }

  // ------------------------------------------------------------------
  // Inject styles
  // ------------------------------------------------------------------
  function _injectStyles () {
    if ($('#inv-styles').length) return;
    $('<style id="inv-styles">\n' +
      '#inv-panel {\n' +
      '  margin-top: 1.5rem;\n' +
      '  padding: 0.75rem 1rem;\n' +
      '  border: 1px solid rgba(128,128,128,0.3);\n' +
      '  border-radius: 6px;\n' +
      '  background: rgba(0,0,0,0.05);\n' +
      '}\n' +
      '.dark-mode #inv-panel {\n' +
      '  background: rgba(255,255,255,0.05);\n' +
      '  border-color: rgba(255,255,255,0.15);\n' +
      '}\n' +
      '.inv-title {\n' +
      '  margin: 0 0 0.5rem;\n' +
      '  font-size: 0.85rem;\n' +
      '  text-transform: uppercase;\n' +
      '  letter-spacing: 0.08em;\n' +
      '  opacity: 0.6;\n' +
      '}\n' +
      '.inv-list {\n' +
      '  list-style: none;\n' +
      '  margin: 0;\n' +
      '  padding: 0;\n' +
      '}\n' +
      '.inv-item {\n' +
      '  display: flex;\n' +
      '  align-items: center;\n' +
      '  gap: 0.4rem;\n' +
      '  padding: 0.2rem 0;\n' +
      '  font-size: 0.9rem;\n' +
      '  cursor: default;\n' +
      '}\n' +
      '.inv-item:hover { opacity: 0.75; }\n' +
      '.inv-icon { font-size: 1.1rem; }\n' +
      '.inv-name { flex: 1; }\n' +
      '.inv-qty {\n' +
      '  font-size: 0.8rem;\n' +
      '  opacity: 0.6;\n' +
      '}\n' +
      '.inv-empty {\n' +
      '  font-size: 0.85rem;\n' +
      '  opacity: 0.45;\n' +
      '  font-style: italic;\n' +
      '}\n' +
    '</style>').appendTo('head');
  }

  // ------------------------------------------------------------------
  // Bootstrap — wait for dendryUI to be ready
  // ------------------------------------------------------------------
  function _init () {
    _injectStyles();

    // Restore from Dendry quality if a save was already loaded
    var engine = window.dendryUI && window.dendryUI.dendryEngine;
    if (engine) {
      var saved = engine.state.qualities[INV_QUALITY];
      if (saved) inv._restore(saved);
    }
  }

  // Dendry calls dendryModifyUI before beginGame, so we chain into it.
  var _prevModifyUI = window.dendryModifyUI;
  window.dendryModifyUI = function (ui) {
    var result = _prevModifyUI ? _prevModifyUI(ui) : undefined;
    // Wait one tick so the sidebar DOM exists
    setTimeout(_init, 0);
    return result;
  };

  // Re-render after every new page (items may have changed via Dendry actions)
  var _prevNewPage = window.onNewPage;
  window.onNewPage = function () {
    if (_prevNewPage) _prevNewPage();
    // Sync from quality in case Dendry script changed inv_data directly
    var engine = window.dendryUI && window.dendryUI.dendryEngine;
    if (engine) {
      var q = engine.state.qualities[INV_QUALITY];
      if (q && q !== JSON.stringify(_items)) inv._restore(q);
    }
    _render();
  };

  // ------------------------------------------------------------------
  // Expose globally so Dendry $set / onArrival scripts can call it
  // ------------------------------------------------------------------
  window.inv = inv;

}());


// =============================================================
//  HOW TO USE FROM DENDRY SCENE FILES
// =============================================================
//
//  Award an item:
//    [javascript]
//    window.inv.add('gold_coin', 3);
//
//  Remove an item:
//    [javascript]
//    window.inv.remove('key');
//
//  Check in a viewIf / chooseIf predicate:
//    [javascript]
//    return window.inv.has('sword');
//
//  Or read the count:
//    [javascript]
//    return window.inv.count('bread') >= 2;
//
//  The inventory is automatically saved with each Dendry save slot
//  because it is mirrored into the `inv_data` quality.
//  No extra save/load wiring needed beyond what game.js already does.
// =============================================================
