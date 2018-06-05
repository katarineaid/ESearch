
const createFromServices = require('./createFromServices');
const createDocuments = require('./createDocuments');
const deleteIndex = require('./deleteIndex');
const listingAllIndex = require('./listingAllIndex');
const deleteAllDocumentsInIndex = require('./deleteAllDocumentsInIndex');
const createOneDoc = require('./createOneDoc');
const search = require('./search');
const deleteDocs = require('./deleteDocs');
const createSomeDocs = require('./createSomeDocs');
const delAllIndexes = require('./delAllIndexes');


function routers(services, router) {
  router.get('/index', function(req, res, next) {
    res.render('index', {title: 'Express'});
  });
  /**
   * Возвращает информацию об индексах
   */
  router.get('/listing', listingAllIndex(services));
  /**
   * Удаляет все индексы в Elasticsearch
   */
  router.post('/delAllIndexes', delAllIndexes(services));
  /**
   * Создает mappings сервисов
   */
  router.get('/create/mappings', createFromServices(services));
  /**
   * Загружает данные с сервисов в Elasticsearch
   */
  router.get('/create/services/documents', createDocuments(services));
  /**
   * Создает документ, содержащий информацию об одном объекте
   */
  router.post('/create/services/document', createOneDoc(services));
  /**
   * Изменяет документ, содержащий информацию об одном объекте
   */
  router.post('/update/services/document', createOneDoc(services));
  /**
   * Удаляет ОДИН индекс в Elasticsearch
   */
  router.post('/delete/index', deleteIndex(services));
  /**
   * ПОИСК
   */
  router.post('/search', search(services));
  /**
   * Удаляет все документы в index
   */
  router.post('/delete/all/documents', deleteAllDocumentsInIndex(services));
  /**
   * Создает документы о нескольких объектах
   */
  router.post('/create/documents', createSomeDocs(services));
  /**
   * Обновляет документы с информацией о нескольких объектах
   */
  router.post('/update/documents', createSomeDocs(services));
  /**
   * Удаляет несколько документов
   */
  router.post('/delete/documents', deleteDocs(services));
  return router
}


module.exports = routers;