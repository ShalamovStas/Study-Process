import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper } from '../models/AppHelper';
import { Conspect } from '../models/Conspect';
import { Editor, toDoc, toHTML, Toolbar, Validators } from 'ngx-editor';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';
import { StepperService } from '../services/StepperService';

class LearnConspectModel {
  Length: number = 0;
  sections: Array<ConspectSection> = [];
}

class ConspectSection {
  title: string = "";
  html: string = "";
}

@Component({
  selector: 'app-conspect',
  templateUrl: './conspect.component.html',
  styleUrls: ['./conspect.component.scss']
})
export class ConspectComponent implements OnInit, OnDestroy {
  conspect: Conspect = new Conspect();
  loading: boolean = true;

  learnConspectMode: boolean = false;
  editMode: boolean = false;

  learnConspectModel: LearnConspectModel = new LearnConspectModel();

  //editor
  form = new FormGroup({
    editorContent: new FormControl(
      { value: { type: "doc", content: [] }, disabled: false },
      Validators.required()
    )
  });

  editor: Editor = new Editor();
  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];

  constructor(private activateRoute: ActivatedRoute, private router: Router, private db: FirebaseDataProviderService,
    public stepperService: StepperService<ConspectSection>) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params["id"];

      if (!id) {
        this.router.navigate(['/conspects-list']);
        return;
      }

      let cached = AppHelper.getCachedConspects();
      if (!cached.success) {
        this.router.navigate(['/conspects-list']);
        return;
      }

      let thisConspect = cached.result.find(x => x.id === id);

      if (!thisConspect) {
        this.router.navigate(['/conspects-list']);
        return;
      }
      else
        this.conspect = thisConspect;

      this.form.get("editorContent")?.setValue(toDoc(this.conspect.html));
      this.setEditorHeight();
    });
  }

  setEditorHeight() {
    let heightElement = 100;
    let editor = document.getElementsByClassName("NgxEditor")[0] as HTMLElement;

    if (!editor) return;

    editor.style.height = `${heightElement}vh`;
    editor.style.overflow = "scroll";

    let wrapper = document.getElementsByTagName("mat-drawer-content")[0] as HTMLElement;
    if (!wrapper) return;

    for (let index = 0; index < 10; index++) {
      heightElement -= 10;
      editor.style.height = `${heightElement}vh`;
      if (wrapper.scrollHeight == wrapper.offsetHeight) {
        heightElement -= 10;
        editor.style.height = `${heightElement}vh`;
        return;
      }
    }
  }

  save() {
    let textJSON = this.form.get("editorContent")?.value?.content;

    for (let index = 0; index < textJSON.length; index++) {
      const line = textJSON[index];
      if (!line.content) {
        line.content = new Array();
        line.content.push({ type: 'text', text: '.' })
      }
    }

    let model = {
      type: "doc",
      content: textJSON
    };

    this.conspect.html = toHTML(model);

    AppHelper.updateCachedConspect(this.conspect);
    this.db.updateConspect(this.conspect);
    this.editMode = false;
  }

  edit() {
    this.disableLearnConspect();
    this.form.get("editorContent")?.setValue(toDoc(this.conspect.html));
    this.editMode = true;
  }

  closeEditMode() {
    this.editMode = false;
  }

  onLearnConspectModeClick() {
    this.learnConspectMode = !this.learnConspectMode;
    if (!this.learnConspectMode)
      return;

    let splittedConspect = this.conspect.html.split("<h1>");

    this.learnConspectModel = new LearnConspectModel();

    splittedConspect.forEach(fragment => {
      if (!fragment)
        return;

      let header = fragment.split("</h1>");

      let conspectSection = new ConspectSection();
      conspectSection.title = header[0];
      conspectSection.html = header[1];

      this.learnConspectModel.sections.push(conspectSection);
    });

    this.learnConspectModel.Length = this.learnConspectModel.sections.length;
    this.stepperService.init(this.learnConspectModel.sections);
  }

  disableLearnConspect() {
    this.learnConspectMode = false;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
