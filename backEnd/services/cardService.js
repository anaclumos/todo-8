var cardRepo = require("../repositories/cardRepository.js");
const moment = require("moment");
const { Card } = require("../models/card.js");

/*
  request -> router -> service -> repo -> db -> CRUD models -> repo -> service -> router -> response
 */

async function createCard(cardParams) {
  cardParams.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
  cardParams.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
  let cardDTO = new Card(cardParams);

  let res = await cardRepo.createCard(cardDTO);
  if (res === "ER_DUP_ENTRY") {
    return { result: "fail", message: "이미 존재하는 카드입니다." };
  } else {
    let card = await cardRepo.getCardById(res);
    return { result: "ok", message: "추가 완료", card: card[0] };
  }
}
async function getAllCards() {
  let cardList = await cardRepo.getAllCards();
  if (cardList.length == 0) {
    return { result: "fail", message: "데이터가 존재하지 않습니다." };
  } else {
    return { result: "ok", message: "검색 완료", cardList: cardList };
  }
}

async function getCardById(id) {
  let card = await cardRepo.getCardById(id);
  if (card.length == 0) {
    return { result: "fail", message: "존재하지 않는 카드입니다." };
  } else {
    return { result: "ok", message: "검색 완료", card: card[0] };
  }
}

async function deleteCard(id) {
  let card = await cardRepo.getCardById(id);

  if (card.length == 0) {
    return { result: "fail", message: "존재하지 않는 카드입니다." };
  } else {
    let cardId = card[0].cardId;
    cardRepo.deleteCard(id);
    return { result: "ok", message: `${cardId} 을 삭제했습니다.` };
  }
}

async function updateCard(newCard) {
  let card = await cardRepo.getCardById(newCard.id);

  if (card.length == 0) {
    return { result: "fail", message: "존재하지 않는 카드입니다." };
  } else {
    newCard.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
    let cardDTO = new Card(newCard);

    await cardRepo.updateCard(cardDTO);

    let card = await cardRepo.getCardById(cardDTO.getId());

    return {
      result: "ok",
      message: `${cardDTO.getCardId()} 정보를 수정했습니다.`,
      card: card[0],
    };
  }
}
module.exports = {
  createCard,
  getAllCards,
  getCardById,
  deleteCard,
  updateCard,
};
