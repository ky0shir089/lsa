<template>
  <v-card flat>
    <v-card-title>Foto Unit</v-card-title>

    <v-container fluid>
      <v-form v-model="valid">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Tanggal</th>
                <th class="text-center">Jenis Foto</th>
                <th class="text-center">Foto 1</th>
                <th class="text-center">Foto 2</th>
                <th class="text-center">Foto 3</th>
                <th class="text-center">Foto 4</th>
                <th class="text-center">Foto 5</th>
              </tr>
            </thead>

            <tbody v-viewer="{ movable: false }">
              <tr v-for="item in unit.photos" :key="item.id">
                <td>
                  {{ item.unit_photo_date }}
                </td>

                <td>
                  {{ item.photo_type }}
                </td>

                <td>
                  <img
                    :src="getImage(item.photo1)"
                    width="100"
                    height="100"
                    style="cursor: pointer"
                  />
                </td>

                <td v-if="item.photo2 != null">
                  <img
                    :src="getImage(item.photo2)"
                    width="100"
                    height="100"
                    style="cursor: pointer"
                  />
                </td>

                <td v-if="item.photo3 != null">
                  <img
                    :src="getImage(item.photo3)"
                    width="100"
                    height="100"
                    style="cursor: pointer"
                  />
                </td>

                <td v-if="item.photo4 != null">
                  <img
                    :src="getImage(item.photo4)"
                    width="100"
                    height="100"
                    style="cursor: pointer"
                  />
                </td>

                <td v-if="item.photo5 != null">
                  <img
                    :src="getImage(item.photo5)"
                    width="100"
                    height="100"
                    style="cursor: pointer"
                  />
                </td>
              </tr>

              <tr align="center">
                <td>
                  {{ form.unit_photo_date }}
                </td>

                <td>
                  <v-autocomplete
                    v-model="form.photo_id"
                    :items="types"
                    item-text="photo_type"
                    item-value="id"
                    outlined
                    dense
                    hide-selected
                    :rules="formRules"
                    @change="selectType"
                  ></v-autocomplete>
                </td>

                <td>
                  <img
                    :src="form.preview1"
                    width="100"
                    height="100"
                    v-if="form.preview1 != null"
                  />

                  <image-uploader
                    v-model="form.photo1"
                    :quality="0.7"
                    :autoRotate="true"
                    outputFormat="blob"
                    :preview="false"
                    :className="[
                      'fileInput',
                      { 'fileinput--loaded': hasImage },
                    ]"
                    capture="environment"
                    accept="image/*"
                    @input="setImage('photo1')"
                    id="photo1"
                  >
                    <label
                      for="photo1"
                      slot="upload-label"
                      style="cursor: pointer"
                    >
                      <v-icon>mdi-camera</v-icon>
                      <br />
                      <span class="upload-caption">
                        {{ hasImage ? "Replace" : "Click to upload" }}
                      </span>
                    </label>
                  </image-uploader>
                </td>

                <td>
                  <img
                    :src="form.preview2"
                    width="100"
                    height="100"
                    v-if="form.preview2 != null"
                  />

                  <image-uploader
                    v-model="form.photo2"
                    :quality="0.7"
                    :autoRotate="true"
                    outputFormat="blob"
                    :preview="false"
                    :className="[
                      'fileInput',
                      { 'fileinput--loaded': hasImage },
                    ]"
                    capture="environment"
                    accept="image/*"
                    @input="setImage('photo2')"
                    id="photo2"
                  >
                    <label
                      for="photo2"
                      slot="upload-label"
                      style="cursor: pointer"
                    >
                      <v-icon>mdi-camera</v-icon>
                      <br />
                      <span class="upload-caption">
                        {{ hasImage ? "Replace" : "Click to upload" }}
                      </span>
                    </label>
                  </image-uploader>
                </td>

                <td>
                  <img
                    :src="form.preview3"
                    width="100"
                    height="100"
                    v-if="form.preview3 != null"
                  />

                  <image-uploader
                    v-model="form.photo3"
                    :quality="0.7"
                    :autoRotate="true"
                    outputFormat="blob"
                    :preview="false"
                    :className="[
                      'fileInput',
                      { 'fileinput--loaded': hasImage },
                    ]"
                    capture="environment"
                    accept="image/*"
                    @input="setImage('photo3')"
                    id="photo3"
                  >
                    <label
                      for="photo3"
                      slot="upload-label"
                      style="cursor: pointer"
                    >
                      <v-icon>mdi-camera</v-icon>
                      <br />
                      <span class="upload-caption">
                        {{ hasImage ? "Replace" : "Click to upload" }}
                      </span>
                    </label>
                  </image-uploader>
                </td>

                <td>
                  <img
                    :src="form.preview4"
                    width="100"
                    height="100"
                    v-if="form.preview4 != null"
                  />

                  <image-uploader
                    v-model="form.photo4"
                    :quality="0.7"
                    :autoRotate="true"
                    outputFormat="blob"
                    :preview="false"
                    :className="[
                      'fileInput',
                      { 'fileinput--loaded': hasImage },
                    ]"
                    capture="environment"
                    accept="image/*"
                    @input="setImage('photo4')"
                    id="photo4"
                  >
                    <label
                      for="photo4"
                      slot="upload-label"
                      style="cursor: pointer"
                    >
                      <v-icon>mdi-camera</v-icon>
                      <br />
                      <span class="upload-caption">
                        {{ hasImage ? "Replace" : "Click to upload" }}
                      </span>
                    </label>
                  </image-uploader>
                </td>

                <td>
                  <img
                    :src="form.preview5"
                    width="100"
                    height="100"
                    v-if="form.preview5 != null"
                  />

                  <image-uploader
                    v-model="form.photo5"
                    :quality="0.7"
                    :autoRotate="true"
                    outputFormat="blob"
                    :preview="false"
                    :className="[
                      'fileInput',
                      { 'fileinput--loaded': hasImage },
                    ]"
                    capture="environment"
                    accept="image/*"
                    @input="setImage('photo5')"
                    id="photo5"
                  >
                    <label
                      for="photo5"
                      slot="upload-label"
                      style="cursor: pointer"
                    >
                      <v-icon>mdi-camera</v-icon>
                      <br />
                      <span class="upload-caption">
                        {{ hasImage ? "Replace" : "Click to upload" }}
                      </span>
                    </label>
                  </image-uploader>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-form>
    </v-container>

    <v-card-actions>
      <v-btn
        block
        color="primary"
        :loading="loading"
        :disabled="!valid || form.photo1 == null"
        @click="store"
      >
        <v-icon left>mdi-content-save</v-icon>
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ImageUploader from "vue-image-upload-resize";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import Vue from "vue";

Vue.use(VueViewer);

export default {
  name: "FormPhoto",
  props: ["unit"],
  components: {
    ImageUploader,
  },
  data: () => ({
    photos: [],
    valid: true,
    form: {
      unit_photo_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      photo_id: "",
      photo1: null,
      preview1: null,
      photo2: null,
      preview2: null,
      photo3: null,
      preview3: null,
      photo4: null,
      preview4: null,
      photo5: null,
      preview5: null,
    },
    default: {
      unit_photo_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      photo_id: "",
      photo1: null,
      preview1: null,
      photo2: null,
      preview2: null,
      photo3: null,
      preview3: null,
      photo4: null,
      preview4: null,
      photo5: null,
      preview5: null,
    },
    formRules: [(v) => !!v || "Field is required"],
    types: [],
    hasImage: false,
    image: null,
    loading: false,
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async getType() {
      await this.axios
        .get("setup-asset/v1/photo", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.types = data;
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    selectType() {
      let type = this.types.filter((item) => item.id == this.form.photo_id)[0];
      let check = this.unit.photos.filter(
        (item) => this.form.photo_id == item.photo_id
      );
      if (check.length > 0 && type.updateable == "NO") {
        this.$nextTick(() => {
          this.form.photo_id = "";
        });
        this.setAlert({
          status: true,
          color: "error",
          text: "anda sudah tidak bisa mengupload foto jenis ini",
        });
      }
    },
    setImage(photo) {
      const reader = new FileReader();

      if (photo == "photo1") {
        reader.onload = (e) => {
          this.form.preview1 = e.target.result;
        };
        reader.readAsDataURL(this.form.photo1);
      }

      if (photo == "photo2") {
        reader.onload = (e) => {
          this.form.preview2 = e.target.result;
        };
        reader.readAsDataURL(this.form.photo2);
      }

      if (photo == "photo3") {
        reader.onload = (e) => {
          this.form.preview3 = e.target.result;
        };
        reader.readAsDataURL(this.form.photo3);
      }

      if (photo == "photo4") {
        reader.onload = (e) => {
          this.form.preview4 = e.target.result;
        };
        reader.readAsDataURL(this.form.photo4);
      }

      if (photo == "photo5") {
        reader.onload = (e) => {
          this.form.preview5 = e.target.result;
        };
        reader.readAsDataURL(this.form.photo5);
      }
    },
    async store() {
      let r = window.confirm("apakah anda yakin?");

      if (r) {
        let check = this.unit.photos.filter((item) => {
          return (
            this.form.unit_photo_date == item.unit_photo_date &&
            this.form.photo_id == item.photo_id
          );
        });

        if (check.length > 0) {
          this.setAlert({
            status: true,
            color: "error",
            text: "anda sudah mengupload jenis foto ini di hari ini",
          });
        } else {
          this.loading = true;

          let formData = new FormData();
          formData.set("data_unit_id", this.unit.id);
          formData.set("unit_photo_date", this.form.unit_photo_date);
          formData.set("photo_id", this.form.photo_id);
          formData.set("photo1", this.form.photo1, "photo1.jpg");
          if (this.form.photo2 != null) {
            formData.set("photo2", this.form.photo2, "photo2.jpg");
          }
          if (this.form.photo3 != null) {
            formData.set("photo3", this.form.photo3, "photo3.jpg");
          }
          if (this.form.photo4 != null) {
            formData.set("photo4", this.form.photo4, "photo4.jpg");
          }
          if (this.form.photo5 != null) {
            formData.set("photo5", this.form.photo5, "photo5.jpg");
          }
          await this.axios
            .post("list-asset/v1/store-unit-photo", formData, {
              headers: {
                Authorization: "Bearer " + this.access_token,
              },
            })
            .then((response) => {
              let { data } = response;
              this.setAlert({
                status: true,
                color: "success",
                text: data.message,
              });
              this.$nextTick(() => {
                this.form = Object.assign({}, this.default);
              });
              this.$parent.getMaster();
              this.loading = false;
            })
            .catch((error) => {
              let responses = error.response.data;
              this.setAlert({
                status: true,
                color: "error",
                text: responses.message,
              });
              this.loading = false;
            });
        }
      }
    },
  },
  async created() {
    await this.getType();
  },
};
</script>

<style>
#photo1 {
  display: none;
}

#photo2 {
  display: none;
}

#photo3 {
  display: none;
}

#photo4 {
  display: none;
}

#photo5 {
  display: none;
}
</style>