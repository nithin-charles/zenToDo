import { Injectable } from '@angular/core';
import { ProjectDbPath, ProjectToDoItems, ToDosDbPath } from '../models/DbPath';
import { ToDoItem } from '../models/ToDoItem';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Project } from '../models/Project';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FireStoreService {
  private dbPath_ToDoItem: string = ToDosDbPath;
  private dbPath_Project: string = ProjectDbPath;
  private dbPath_ProjectToDoItems: string = ProjectToDoItems;

  toDoRef: AngularFireList<ToDoItem>;
  projectRef: AngularFireList<Project>;
  projectToDoItemRef: AngularFireList<ToDoItem>;
  public isTaskStatusUpdate: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /**
   *
   */
  constructor(private db: AngularFireDatabase) {
    this.toDoRef = db.list(this.dbPath_ToDoItem);
    this.projectRef = db.list(this.dbPath_Project);
    this.projectToDoItemRef = db.list(this.dbPath_ProjectToDoItems);
  }

  //#region "ToDoItems"
  public getAllToDoItems() {
    return this.toDoRef;
  }

  public getToDoItem(key: string) {
    return this.db.object(`${this.dbPath_ToDoItem}/${key}`);
  }

  public addToDoItem(item: ToDoItem) {
    this.toDoRef.push(item);
  }

  public updateToDoItem(key: any, item: ToDoItem) {
    this.toDoRef.update(key, item);
  }

  public deleteToDoItem(key: string) {
    this.toDoRef.remove(key);
  }
  //#endregion "ToDoItems"

  //#region "Projects"

  public getAllProjects() {
    return this.projectRef;
  }

  public addProject(projectItem: Project) {
    this.projectRef.push(projectItem);
  }

  public getProjectByKey(key: string) {
    return this.db.object(`${this.dbPath_Project}/${key}`);
  }

  public getToDoItemsByProject(project: string) {
    return this.db.list('Project_ToDoItems', (ref) =>
      ref.orderByChild('project').equalTo(project)
    );
  }

  public updateProject(key: string, project: Project) {
    this.projectRef.update(key, project);
  }

  public deleteProject(key: string, projectName: string) {
    this.projectRef.remove(key);
    var toDoKeys = [];
    this.db
      .list('Project_ToDoItems', (ref) =>
        ref.orderByChild('project').equalTo(projectName)
      )
      .snapshotChanges()
      .subscribe((item) => {
        item.forEach((x) => {
          toDoKeys.push(x.key);
          if (x.key) {
            this.projectToDoItemRef.remove(x.key);
          }
        });
      });
  }
  //#endregion "Projects"

  //#region "ProjectToDoItems"

  public addProjectToDoItem(item: ToDoItem) {
    this.projectToDoItemRef.push(item);
  }

  public updateProjectToDoItem(key: any, todoItem: ToDoItem) {
    this.projectToDoItemRef.update(key, todoItem);
  }

  public deleteProjectToDoItem(key: string) {
    this.projectToDoItemRef.remove(key);
  }

  //#endregion
}
