'use strict';
angular.module('services.factory', ['ngRoute','ngResource'])

    .factory('fabrica', function () {
        var data = {
            listado: []
        };
        return {
            getListado: function () {
                return data.listado;
            },
            addTodo: function (todo) {
                data.listado.push(todo);
            }};
    })

    .factory('addTarea', function($resource) {
                 var nuevaTarea = $resource('/tareas/agregar');
                 return nuevaTarea;
    })

     .factory('tareas', function($resource) {
             var Tareas = $resource('/tareas/:tarea');
             return Tareas;
    });