<template>
	<div>
		<h2>{{ Title }}</h2>
		<p>
			<!-- <input type="file" id="file" @change="selectedFile" /> -->
			<b-form-file
				@change="selectedFile"
				placeholder="ファイルを選択してください"
				class="mb-4"
			></b-form-file>
			<label id="output"></label>
			<b-button
				v-on:click="confirmOpened = true"
				v-bind:disabled="uploadFile == null"
				style="margin-right: 10px"
				>アップロード</b-button
			>
			<b-button v-on:click="reload()">リロード</b-button>
		</p>
		<div class="upload-list">
			<li v-for="file in FileList" v-bind:key="file.id">
				<span class="file">
					<div
						class="upload-image"
						:style="{ backgroundImage: 'url(' + file.file_path + ')' }"
						v-on:click="imagemodal(file.file_path)"
					>
						<!-- <img class="upload-image" :src="file.url"> -->
					</div>
					<h2 class="upload-text-title">ファイル名:</h2>
					<div class="upload-text">{{ file.Key }}</div>
					<h2 class="upload-text-title">最終更新日:</h2>
					<div class="upload-text">{{ file.LastModified }}</div>
					<b-button class="clipcopy" :data-clipboard-text="getTag(file.Key)"
						>コピー</b-button
					>
				</span>
			</li>
		</div>
		<transition name="modal" v-if="confirmOpened">
			<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container">
						<div class="modal-header">
							<h3>アップロード</h3>
						</div>
						<div class="modal-body">
							<p>次のファイルをアップロードします。</p>
							<table class="file-table" align="center">
								<tr>
									<th>ローカルファイル名</th>
									<th>リモートファイル名</th>
								</tr>
								<tr>
									<td>{{ uploadFile.name }}</td>
									<td>
										<input
											type="text"
											v-model="fileName"
											:placeholder="uploadFile.name"
										/>
									</td>
								</tr>
							</table>

							<br />
							<br />
							<p class="appendix">
								※アップロード先でファイル名を変更する場合は、リモートファイル名に変更後の名前を入力してください。
								<br />(未入力の場合や、スペースのみ入力されている場合は、ローカルファイル名が使用されます)
							</p>
							<p class="appendix">
								※日本語、英数字(a～z,A～Z,0～9)、および、各種記号が利用できます。
								<br />(記号は「", ?, :, |, &lt;, >, *, \, スペース」以外のもの)
							</p>
							<p>よろしいですか？</p>
						</div>
						<div class="modal-footer">
							<b-button @click="cancel()">Cancel</b-button>
							<b-button @click="ok(message)">OK</b-button>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts" src="./index.ts"></script>
<style>
.upload-image {
	width: 150px;
	height: 150px;
	border: solid 0.1px #999999;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center center;
}
.upload-text {
	white-space: nowrap;
	width: 150px;
	font-size: 12px;
	margin: 0 5px 5px 0;
	text-overflow: ellipsis;
	overflow: hidden;
}
.upload-text-title {
	width: 150px;
	font-size: 10px;
	margin: 10px 0 5px 0;
	padding-left: 5px;
	border-bottom: thin dashed #4169e1;
	border-left: thin solid #4169e1;
}
.upload-list li {
	list-style: none;
	display: inline-block;
	margin-left: 10px;
}
.file {
	margin: 2px;
}
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10;
	background: rgba(0, 0, 0, 0.7);
	transform: translate3d(0, 0, 0);
}
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}
.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}
.modal-container {
	width: 100%;
	margin: 0px auto;
	padding: 20px 30px;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
	margin-top: 0;
	color: #42b983;
}
.modal-body {
	margin: 20px 0;
}
.modal-enter {
	opacity: 0;
}
.modal-leave-active {
	opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
.appendix {
	font-size: 8px;
}
.file-table {
	font-size: 12px;
}
</style>
<style type="sass" scoped></style>
